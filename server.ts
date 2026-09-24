import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
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

const SESSION_SECRET = process.env.SESSION_SECRET || process.env.JWT_SECRET || 'engiquiz_session_secret_change_in_prod_xyz';

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Connect to MongoDB Atlas (or initialize local sandbox fallback) asynchronously
  connectMongo().catch(() => {});

  // Cookie parser helper
  function parseCookies(req: Request): Record<string, string> {
    const list: Record<string, string> = {};
    const cookieHeader = req.headers.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(';').forEach(cookie => {
      let [name, ...rest] = cookie.split('=');
      name = name?.trim();
      if (!name) return;
      const value = rest.join('=').trim();
      try {
        list[name] = decodeURIComponent(value);
      } catch {
        list[name] = value;
      }
    });

    return list;
  }

  // Cryptographically signed session token generator (HMAC SHA-256)
  function createToken(userId: string): string {
    const payload = {
      userId,
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr)
      .digest('base64url');
    return `${payloadStr}.${signature}`;
  }

  // Token signature and expiration verification
  function verifyToken(token: string): { userId: string } | null {
    if (!token || typeof token !== 'string') return null;
    const parts = token.split('.');
    if (parts.length !== 2) return null;

    const [payloadStr, signature] = parts;
    const expectedSig = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadStr)
      .digest('base64url');

    try {
      const sigBuffer = Buffer.from(signature);
      const expectedBuffer = Buffer.from(expectedSig);
      if (sigBuffer.length !== expectedBuffer.length) return null;
      if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null;

      const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf8'));
      if (!payload.userId || !payload.exp || Date.now() > payload.exp) {
        return null;
      }
      return { userId: payload.userId };
    } catch {
      return null;
    }
  }

  // Stateless authentication validator: extracts user from Bearer header or HTTP-only cookie
  function getUserIdFromReq(req: Request): string | null {
    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      const verified = verifyToken(token);
      if (verified) return verified.userId;
    }

    // 2. Check HTTP-only session cookie
    const cookies = parseCookies(req);
    if (cookies['engiquiz_session']) {
      const verified = verifyToken(cookies['engiquiz_session']);
      if (verified) return verified.userId;
    }

    return null;
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
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('engiquiz_session', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

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
      const isProduction = process.env.NODE_ENV === 'production';
      res.cookie('engiquiz_session', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
      });

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
        return res.status(401).json({ success: false, error: 'User not found' });
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
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('engiquiz_session', {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/'
    });
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
        return res.status(401).json({ success: false, error: 'User not found.' });
      }

      if (attempt) {
        // Enforce user isolation: strictly associate attempt with authenticated user
        await saveAttempt({
          ...attempt,
          id: attempt.id || `quiz_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
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
        attempts: attempts || [],
        bookmarks: bookmarks || []
      });
    } catch (err: any) {
      return res.status(500).json({ success: false, error: err.message });
    }
  });

  // Health check endpoint for Render and monitoring
  app.get('/healthz', (_req: Request, res: Response) => {
    res.status(200).send('OK');
  });

  app.get('/api/health', (_req: Request, res: Response) => {
    res.status(200).json({ status: 'healthy', uptime: process.uptime(), timestamp: new Date().toISOString() });
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

      // Handle dashboard route
      if (rawPath === 'dashboard' || rawPath === 'dashboard.html') {
        const userId = getUserIdFromReq(req);
        if (!userId) {
          return res.redirect('/login.html?redirect=index.html');
        }
        return res.redirect('/index.html');
      }

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

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[EngiQuiz Server] Running at http://0.0.0.0:${PORT}`);
  });

  // Graceful shutdown handlers to cleanly handle Render deployment rollovers without exit code 143
  const handleShutdown = (signal: string) => {
    console.log(`[EngiQuiz Server] Received ${signal}, closing server gracefully...`);
    server.close(() => {
      console.log('[EngiQuiz Server] HTTP server closed cleanly.');
      process.exit(0);
    });

    // Force close after 5 seconds if connections hang
    setTimeout(() => {
      console.warn('[EngiQuiz Server] Force exiting process.');
      process.exit(0);
    }, 5000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer().catch(err => {
  console.error('[EngiQuiz Server] Fatal initialization error:', err);
  process.exit(1);
});
