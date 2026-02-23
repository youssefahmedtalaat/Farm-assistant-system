import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import cropsRoutes from './routes/crops.js';
import subscriptionRoutes from './routes/subscription.js';
import activitiesRoutes from './routes/activities.js';
import notificationsRoutes from './routes/notifications.js';
import messagesRoutes from './routes/messages.js';
import pool from './db/connection.js';
import { generateUUID } from './db/uuid_helper.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/crops', cropsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/messages', messagesRoutes);

// Legacy route compatibility (for existing frontend)
// Mount auth routes on legacy API path
app.use('/make-server-a88cdc1e/api/auth', authRoutes);

// Handle signup on legacy path (duplicate handler)
app.post('/make-server-a88cdc1e/signup', async (req, res) => {
  try {
    const { email, password, fullName, farmName, role } = req.body;

    if (!email || !password || !fullName) {
      return res.status(400).json({ error: 'Email, password, and full name are required' });
    }

    // Validate role
    const userRole = role === 'admin' ? 'admin' : 'farmer';

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase()]);
    
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const userId = generateUUID();

    // Create user
    await pool.query(
      `INSERT INTO users (id, email, password_hash, full_name, farm_name, role, email_verified)
       VALUES (?, ?, ?, ?, ?, ?, true)`,
      [userId, email.toLowerCase(), passwordHash, fullName, farmName || '', userRole]
    );

    // Fetch the created user (MySQL doesn't support RETURNING)
    const result = await pool.query(
      'SELECT id, email, full_name, farm_name, role, created_at FROM users WHERE id = ?',
      [userId]
    );

    const user = result.rows[0];

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.status(201).json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.full_name,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Mount all legacy routes properly - use app.use to mount routers
app.use('/make-server-a88cdc1e/profile', profileRoutes);
app.use('/make-server-a88cdc1e/crops', cropsRoutes);
app.use('/make-server-a88cdc1e/subscription', subscriptionRoutes);
app.use('/make-server-a88cdc1e/activities', activitiesRoutes);
app.use('/make-server-a88cdc1e/notifications', notificationsRoutes);

app.get('/make-server-a88cdc1e/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  console.log(`404 - Route not found: ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Route not found', path: req.path, method: req.method });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

