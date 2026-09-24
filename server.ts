import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import {
  connectMongo,
  getMongoStatus,
  findUserByEmail,
  findUserById,
  createUser,
  updateUserProfile,
  updateUserPassword,
  verifyPassword,
  saveAttempt,
  getUserAttempts,
  saveBookmarks,
  getUserBookmarks
} from './src/db/mongo.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB Atlas (or initialize local sandbox fallback) asynchronously
  connectMongo().catch(() => {});

  // Simple token generator / decoder using base64 + timestamp
  function createToken(userId: string): string {
    const payload = JSON.stringify({ userId, ts: Date.now() });
    return Buffer.from(payload).toString('base64');
  }

  function getUserIdFromReq(req: Request): string | null {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
    try {
      const token = authHeader.substring(7);
      const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
      return decoded.userId || null;
    } catch {
      return null;
    }
  }

  // ==========================================
  // MongoDB Atlas Status & Retry Endpoints
  // ==========================================
  app.get('/api/mongo/status', async (req: Request, res: Response) => {
    try {
      const status = await getMongoStatus();
      res.json({
        success: true,
        ...status
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/mongo/retry', async (req: Request, res: Response) => {
    try {
      await connectMongo();
      const status = await getMongoStatus();
      res.json({
        success: true,
        ...status
      });
    } catch (err: any) {
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // Authentication Routes
  // ==========================================
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const { email, password, name, branch, targetExam, avatar } = req.body;

      if (!email || !password || !name) {
        return res.status(400).json({ success: false, error: 'Email, password, and name are required.' });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      }

      const existing = await findUserByEmail(email);
      if (existing) {
        return res.status(400).json({ success: false, error: 'An account with this email address already exists.' });
      }

      const newUser = await createUser({
        email,
        password,
        name,
        branch: branch || 'Computer Science & Engineering (CSE)',
        targetExam: targetExam || 'Campus Placements & Coding Rounds',
        avatar: avatar || '🎓'
      });

      const token = createToken(newUser.id);

      return res.status(201).json({
        success: true,
        message: 'Registration successful! Profile connected to MongoDB Atlas.',
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          branch: newUser.branch,
          targetExam: newUser.targetExam,
          avatar: newUser.avatar,
          createdAt: newUser.createdAt
        }
      });
    } catch (err: any) {
      console.error('[Auth Register Error]:', err);
      return res.status(500).json({ success: false, error: err.message || 'Registration failed.' });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, error: 'Email and password are required.' });
      }

      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const isValid = verifyPassword(password, user.passwordHash, user.salt);
      if (!isValid) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const token = createToken(user.id);

      return res.json({
        success: true,
        message: 'Signed in successfully!',
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          branch: user.branch,
          targetExam: user.targetExam,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } catch (err: any) {
      console.error('[Auth Login Error]:', err);
      return res.status(500).json({ success: false, error: err.message || 'Login failed.' });
    }
  });

  app.post('/api/auth/reset-password', async (req: Request, res: Response) => {
    try {
      const { email, newPassword } = req.body;
      if (!email || !newPassword) {
        return res.status(400).json({ success: false, error: 'Email and new password are required.' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters.' });
      }

      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ success: false, error: 'No account found with this email address.' });
      }

      const success = await updateUserPassword(email, newPassword);
      if (!success) {
        return res.status(500).json({ success: false, error: 'Failed to update password.' });
      }

      return res.json({
        success: true,
        message: 'Password reset successfully! You can now sign in with your new password.'
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message || 'Password reset failed.' });
    }
  });

  app.get('/api/auth/me', async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          branch: user.branch,
          targetExam: user.targetExam,
          avatar: user.avatar,
          createdAt: user.createdAt
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.put('/api/auth/profile', async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Not authenticated' });
      }

      const { name, branch, targetExam, avatar } = req.body;
      const updated = await updateUserProfile(userId, { name, branch, targetExam, avatar });

      if (!updated) {
        return res.status(404).json({ success: false, error: 'User not found' });
      }

      return res.json({
        success: true,
        message: 'Profile updated and synced to MongoDB Atlas!',
        user: {
          id: updated.id,
          email: updated.email,
          name: updated.name,
          branch: updated.branch,
          targetExam: updated.targetExam,
          avatar: updated.avatar
        }
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    return res.json({ success: true, message: 'Logged out successfully' });
  });

  // ==========================================
  // Cloud Sync Routes for Quiz Data
  // ==========================================
  app.post('/api/user/sync', async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromReq(req);
      const { attempt, bookmarks } = req.body;

      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required to sync data.' });
      }

      const user = await findUserById(userId);
      if (!user) {
        return res.status(404).json({ success: false, error: 'User not found.' });
      }

      if (attempt) {
        await saveAttempt({
          ...attempt,
          userId: user.id,
          userEmail: user.email
        });
      }

      if (Array.isArray(bookmarks)) {
        await saveBookmarks(user.id, bookmarks);
      }

      return res.json({
        success: true,
        message: 'Synced successfully with MongoDB Atlas!',
        timestamp: new Date().toISOString()
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  app.get('/api/user/sync', async (req: Request, res: Response) => {
    try {
      const userId = getUserIdFromReq(req);
      if (!userId) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
      }

      const [attempts, bookmarks] = await Promise.all([
        getUserAttempts(userId),
        getUserBookmarks(userId)
      ]);

      return res.json({
        success: true,
        attempts,
        bookmarks
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // ==========================================
  // Vite Frontend Middleware / Static Serving
  // ==========================================
  const distDir = path.resolve(__dirname, 'dist');
  const distIndex = path.resolve(distDir, 'index.html');
  const hasDist = fs.existsSync(distIndex);

  if (process.env.NODE_ENV !== 'production' && !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'mpa',
    });
    app.use(vite.middlewares);
    console.log('[EngiQuiz Server] Vite MPA dev middleware mounted.');
  } else {
    console.log(`[EngiQuiz Server] Serving production static files (dist found: ${hasDist}).`);

    // Serve built dist assets first if available
    if (hasDist) {
      app.use(express.static(distDir));
    }

    // Always serve static assets from project root (js, css, data) as resilient fallback
    app.use(express.static(__dirname));

    // Multi-Page Application (MPA) Route Resolution with zero-ENOENT guarantee
    app.get('*', (req: Request, res: Response) => {
      // Don't intercept API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, error: 'API endpoint not found' });
      }

      const rawPath = req.path.replace(/^\/+/, '').split('?')[0];
      const targetPage = rawPath.endsWith('.html') ? rawPath : (rawPath ? `${rawPath}.html` : 'index.html');

      // 1. Try file in dist
      if (hasDist) {
        const distFile = path.resolve(distDir, targetPage);
        if (fs.existsSync(distFile)) {
          return res.sendFile(distFile);
        }
      }

      // 2. Try file in project root
      const rootFile = path.resolve(__dirname, targetPage);
      if (fs.existsSync(rootFile)) {
        return res.sendFile(rootFile);
      }

      // 3. Fallback to index.html in dist or root
      if (hasDist && fs.existsSync(distIndex)) {
        return res.sendFile(distIndex);
      }
      const rootIndex = path.resolve(__dirname, 'index.html');
      if (fs.existsSync(rootIndex)) {
        return res.sendFile(rootIndex);
      }

      return res.status(404).send('EngiQuiz: Page Not Found');
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EngiQuiz Server] Running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('[EngiQuiz Server] Fatal initialization error:', err);
  process.exit(1);
});
