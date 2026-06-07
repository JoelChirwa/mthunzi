import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Import routes
import donationRoutes from './routes/donations.js';
import contactRoutes from './routes/contact.js';
import authRoutes from './routes/auth.js';
import webhookRoutes from './routes/webhooks.js';
import projectRoutes from './routes/projects.js';
import blogRoutes from './routes/blogs.js';
import partnerRoutes from './routes/partners.js';
import teamRoutes from './routes/team.js';
import uploadRoutes from './routes/upload.js';
import analyticsRoutes from './routes/analytics.js';
import statsRoutes from './routes/stats.js';
import volunteerRoutes from './routes/volunteers.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/logger.js';
import rateLimit from 'express-rate-limit';

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

app.use(requestLogger);

import connectDB from './lib/db.js';

// Health check
app.get(['/health', '/api/health'], async (req, res) => {
  try {
    // Ping the database to verify connection status
    const db = await connectDB();
    const isConnected = db.connection.readyState === 1;
    if (!isConnected) throw new Error('Database is not connected');
    
    res.json({
      status: 'healthy',
      database: 'connected',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'unhealthy',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Database connection timed out or failed',
      timestamp: new Date().toISOString(),
      environment: NODE_ENV,
    });
  }
});

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  }
});
app.use('/api/', limiter);

// API Routes
app.use('/api/donations', donationRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/webhooks', webhookRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/volunteers', volunteerRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
  });
});

// Error handling middleware
app.use(errorHandler);

// Connect to database then start server
const serverURL = NODE_ENV === 'production'
  ? (process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/api` : `https://mthunzitrust.org/api`)
  : `http://localhost:${PORT}`;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`
        ╔═══════════════════════════════════════╗
        ║  Mthunzi Trust Backend Server         ║
        ║  Status: Running                      ║
        ║  Environment: ${NODE_ENV.padEnd(28)}║
        ║  Port: ${String(PORT).padEnd(33)}║
        ║  URL: ${serverURL.padEnd(31)}║
        ╚═══════════════════════════════════════╝
      `);
    });
  })
  .catch((err) => {
    console.error('Database connection failed on startup:', err);
    // Boot anyway so cPanel doesn't crash, allowing requests to hit the health-check to debug
    app.listen(PORT, () => {
      console.log(`Express started on port ${PORT} (Database disconnected)`);
    });
  });

export default app;
