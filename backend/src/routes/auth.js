import { Router } from 'express';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { authenticate } from '../middleware/authenticate.js';
import User from '../models/User.js';

const router = Router();

/**
 * POST - User Login
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcryptjs.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to login',
    });
  }
});

/**
 * POST - User Signup (admin only — requires valid JWT and ADMIN role)
 */
router.post('/signup', authenticate, async (req, res) => {
  try {
    // Restrict signup only to users with the ADMIN role
    if (!req.user || req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Only administrators can register new accounts.',
      });
    }

    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, and name are required',
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await User.create({
      email,
      name,
      password: hashedPassword,
      role: 'VIEWER',
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create account',
    });
  }
});

export default router;
