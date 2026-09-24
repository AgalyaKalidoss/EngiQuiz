import { MongoClient, Db } from 'mongodb';
import crypto from 'crypto';

export interface UserDocument {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  branch: string;
  targetExam: string;
  avatar: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttemptDocument {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  topic: string;
  difficulty: string;
  questionsCount: number;
  correct: number;
  wrong: number;
  unanswered: number;
  percentage: number;
  timeTaken: string;
  timeTakenSeconds: number;
  date: string;
  questions?: any[];
  userAnswers?: Record<string, number>;
}

export interface BookmarkDocument {
  userId: string;
  questionIds: string[];
  updatedAt: string;
}

let client: MongoClient | null = null;
let db: Db | null = null;
let isConnected = false;
let isIpWhitelistPending = false;
let connectionError: string | null = null;
let clusterHost = '';
let databaseName = 'engiquiz';

// In-memory fallback for local development or when MONGODB_URI is not provided yet
const inMemoryUsers: Map<string, UserDocument> = new Map();
const inMemoryAttempts: AttemptDocument[] = [];
const inMemoryBookmarks: Map<string, string[]> = new Map();

// Seed a demo user for instant testing
const demoSalt = crypto.randomBytes(16).toString('hex');
const demoHash = crypto.pbkdf2Sync('demo123', demoSalt, 1000, 64, 'sha512').toString('hex');
const demoUser: UserDocument = {
  id: 'usr_demo_student',
  email: 'student@engiquiz.edu',
  passwordHash: demoHash,
  salt: demoSalt,
  name: 'Alex Chen',
  branch: 'Computer Science & Engineering (CSE)',
  targetExam: 'Campus Placements & Tech Interviews',
  avatar: '🎓',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};
inMemoryUsers.set(demoUser.email.toLowerCase(), demoUser);

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const checkHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return checkHash === hash;
}

export async function connectMongo(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || !uri.trim()) {
    connectionError = 'MONGODB_URI not configured in environment. Using in-memory persistent store.';
    isConnected = false;
    isIpWhitelistPending = false;
    console.log('[MongoDB Atlas] No MONGODB_URI found. Running with local fallback store.');
    return false;
  }

  try {
    console.log('[MongoDB Atlas] Connecting to MongoDB Atlas cluster...');
    
    // Extract cluster host for telemetry display (masking credentials)
    try {
      const parsed = new URL(uri.replace('mongodb+srv://', 'https://').replace('mongodb://', 'https://'));
      clusterHost = parsed.hostname;
      if (parsed.pathname && parsed.pathname.length > 1) {
        databaseName = parsed.pathname.substring(1).split('?')[0] || 'engiquiz';
      }
    } catch {
      clusterHost = 'atlas-cluster';
    }

    // Clean up any previous client instance
    if (client) {
      try {
        await client.close();
      } catch {}
      client = null;
    }

    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000
    });

    await client.connect();
    db = client.db(databaseName);
    
    // Ping to verify
    await db.command({ ping: 1 });
    
    isConnected = true;
    isIpWhitelistPending = false;
    connectionError = null;
    console.log(`[MongoDB Atlas] Successfully connected to database "${databaseName}" on ${clusterHost}`);

    // Ensure indexes for fast lookups
    const usersCol = db.collection('users');
    await usersCol.createIndex({ email: 1 }, { unique: true }).catch(() => {});
    const attemptsCol = db.collection('attempts');
    await attemptsCol.createIndex({ userId: 1, date: -1 }).catch(() => {});

    // Ensure demo user exists in Mongo Atlas as well
    const existingDemo = await usersCol.findOne({ email: demoUser.email });
    if (!existingDemo) {
      await usersCol.insertOne({ ...demoUser, _id: demoUser.id as any });
    }

    return true;
  } catch (err: any) {
    if (client) {
      try {
        await client.close();
      } catch {}
      client = null;
    }
    db = null;
    isConnected = false;

    const errMsg = err?.message || String(err);
    if (errMsg.includes('SSL alert number 80') || errMsg.includes('tlsv1 alert internal error')) {
      isIpWhitelistPending = true;
      connectionError = `MongoDB Atlas Network Access: Your IP is not whitelisted in Atlas (SSL alert 80). In cloud.mongodb.com -> Network Access, add '0.0.0.0/0' (Allow access from anywhere). Local persistent store is active.`;
      console.log(`[MongoDB Atlas] Notice: Atlas cluster (${clusterHost}) requires IP Whitelisting (SSL alert 80). Running seamlessly with local persistent store.`);
    } else {
      isIpWhitelistPending = false;
      connectionError = errMsg;
      console.log(`[MongoDB Atlas] Notice: Connection deferred (${errMsg}). Running seamlessly with local persistent store.`);
    }
    return false;
  }
}

export async function getMongoStatus() {
  let pingMs: number | null = null;
  if (isConnected && db) {
    try {
      const start = Date.now();
      await db.command({ ping: 1 });
      pingMs = Date.now() - start;
    } catch {
      isConnected = false;
    }
  }

  return {
    connected: isConnected,
    mode: isConnected ? 'atlas' : 'local_ready',
    cluster: clusterHost || (process.env.MONGODB_URI ? 'MongoDB Atlas' : 'Local Sandbox (Atlas Ready)'),
    database: databaseName,
    pingMs,
    isIpWhitelistPending,
    error: connectionError,
    activeUsersCount: isConnected && db ? await db.collection('users').countDocuments().catch(() => 1) : inMemoryUsers.size
  };
}

export async function findUserByEmail(email: string): Promise<UserDocument | null> {
  const normalized = email.trim().toLowerCase();

  if (isConnected && db) {
    try {
      const doc = await db.collection('users').findOne({ email: normalized });
      if (doc) {
        return {
          id: doc.id || doc._id?.toString(),
          email: doc.email,
          passwordHash: doc.passwordHash,
          salt: doc.salt,
          name: doc.name,
          branch: doc.branch,
          targetExam: doc.targetExam,
          avatar: doc.avatar || '🎓',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        };
      }
    } catch (err) {
      console.error('[MongoDB Atlas] Error querying user:', err);
    }
  }

  return inMemoryUsers.get(normalized) || null;
}

export async function findUserById(id: string): Promise<UserDocument | null> {
  if (isConnected && db) {
    try {
      const doc = await db.collection('users').findOne({ id });
      if (doc) {
        return {
          id: doc.id || doc._id?.toString(),
          email: doc.email,
          passwordHash: doc.passwordHash,
          salt: doc.salt,
          name: doc.name,
          branch: doc.branch,
          targetExam: doc.targetExam,
          avatar: doc.avatar || '🎓',
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt
        };
      }
    } catch (err) {
      console.error('[MongoDB Atlas] Error querying user by ID:', err);
    }
  }

  for (const user of inMemoryUsers.values()) {
    if (user.id === id) return user;
  }
  return null;
}

export async function createUser(userData: {
  email: string;
  password: string;
  name: string;
  branch: string;
  targetExam: string;
  avatar?: string;
}): Promise<UserDocument> {
  const normalizedEmail = userData.email.trim().toLowerCase();
  const { hash, salt } = hashPassword(userData.password);

  const newUser: UserDocument = {
    id: `usr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    email: normalizedEmail,
    passwordHash: hash,
    salt,
    name: userData.name.trim(),
    branch: userData.branch || 'Computer Science & Engineering (CSE)',
    targetExam: userData.targetExam || 'Campus Placements',
    avatar: userData.avatar || '🎓',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // Save to in-memory
  inMemoryUsers.set(normalizedEmail, newUser);

  // Save to Mongo Atlas if connected
  if (isConnected && db) {
    try {
      await db.collection('users').insertOne({ ...newUser, _id: newUser.id as any });
      console.log(`[MongoDB Atlas] Successfully inserted new user ${normalizedEmail}`);
    } catch (err: any) {
      console.error('[MongoDB Atlas] Error saving user to Atlas:', err.message);
    }
  }

  return newUser;
}

export async function updateUserPassword(email: string, newPassword: string): Promise<boolean> {
  const normalized = email.trim().toLowerCase();
  const { hash, salt } = hashPassword(newPassword);

  const localUser = inMemoryUsers.get(normalized);
  if (localUser) {
    localUser.passwordHash = hash;
    localUser.salt = salt;
    localUser.updatedAt = new Date().toISOString();
  }

  if (isConnected && db) {
    try {
      const res = await db.collection('users').updateOne(
        { email: normalized },
        { $set: { passwordHash: hash, salt, updatedAt: new Date().toISOString() } }
      );
      return (res.matchedCount > 0) || !!localUser;
    } catch (err) {
      console.error('[MongoDB Atlas] Error updating password:', err);
    }
  }

  return !!localUser;
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<Pick<UserDocument, 'name' | 'branch' | 'targetExam' | 'avatar'>>
): Promise<UserDocument | null> {
  const user = await findUserById(userId);
  if (!user) return null;

  const updated: UserDocument = {
    ...user,
    ...updates,
    updatedAt: new Date().toISOString()
  };

  inMemoryUsers.set(user.email.toLowerCase(), updated);

  if (isConnected && db) {
    try {
      await db.collection('users').updateOne(
        { id: userId },
        { $set: { ...updates, updatedAt: updated.updatedAt } }
      );
    } catch (err) {
      console.error('[MongoDB Atlas] Error updating user profile:', err);
    }
  }

  return updated;
}

export async function saveAttempt(attempt: AttemptDocument): Promise<void> {
  inMemoryAttempts.unshift(attempt);

  if (isConnected && db) {
    try {
      await db.collection('attempts').insertOne({ ...attempt, _id: attempt.id as any });
    } catch (err) {
      console.error('[MongoDB Atlas] Error saving quiz attempt:', err);
    }
  }
}

export async function getUserAttempts(userId: string): Promise<AttemptDocument[]> {
  if (isConnected && db) {
    try {
      const docs = await db.collection('attempts')
        .find({ userId })
        .sort({ date: -1 })
        .limit(100)
        .toArray();
      return docs as unknown as AttemptDocument[];
    } catch (err) {
      console.error('[MongoDB Atlas] Error fetching user attempts:', err);
    }
  }

  return inMemoryAttempts.filter(a => a.userId === userId);
}

export async function saveBookmarks(userId: string, questionIds: string[]): Promise<void> {
  inMemoryBookmarks.set(userId, questionIds);

  if (isConnected && db) {
    try {
      await db.collection('bookmarks').updateOne(
        { userId },
        { $set: { userId, questionIds, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
    } catch (err) {
      console.error('[MongoDB Atlas] Error saving bookmarks:', err);
    }
  }
}

export async function getUserBookmarks(userId: string): Promise<string[]> {
  if (isConnected && db) {
    try {
      const doc = await db.collection('bookmarks').findOne({ userId });
      if (doc && Array.isArray(doc.questionIds)) {
        return doc.questionIds;
      }
    } catch (err) {
      console.error('[MongoDB Atlas] Error fetching bookmarks:', err);
    }
  }

  return inMemoryBookmarks.get(userId) || [];
}
