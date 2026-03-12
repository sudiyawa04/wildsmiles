const bcrypt  = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const db      = require('../config/database');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');
const { AppError } = require('../middleware/errorHandler');
const { sendEmail } = require('../services/emailService');
const crypto  = require('crypto');

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    // Check existing user
    const [exists] = await db.promise().query(
      'SELECT id FROM users WHERE email = ?', [email]
    );
    if (exists.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    const password_hash     = await bcrypt.hash(password, 12);
    const uuid              = uuidv4();
    const email_verify_token = crypto.randomBytes(32).toString('hex');

    const [result] = await db.promise().query(
      `INSERT INTO users (uuid, email, password_hash, first_name, last_name, phone, email_verify_token)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [uuid, email, password_hash, first_name, last_name, phone || null, email_verify_token]
    );

    // Create empty profile
    await db.promise().query(
      'INSERT INTO user_profiles (user_id) VALUES (?)',
      [result.insertId]
    );

    // Send verification email (non-blocking)
    sendEmail({
      to:      email,
      subject: 'Welcome to WildSmiles — Verify your email',
      template: 'verify-email',
      data: {
        name:  first_name,
        link: `${process.env.FRONTEND_URL}/verify-email?token=${email_verify_token}`,
      },
    }).catch(console.error);

    const token = generateAccessToken({ id: result.insertId, uuid, email, role: 'user' });

    res.status(201).json({
      success: true,
      message: 'Account created! Please check your email to verify.',
      token,
      user: { id: result.insertId, uuid, email, first_name, last_name, role: 'user' },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.promise().query(
      'SELECT * FROM users WHERE email = ? AND is_active = 1', [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // Update last_login
    await db.promise().query('UPDATE users SET last_login = NOW() WHERE id = ?', [user.id]);

    const payload      = { id: user.id, uuid: user.uuid, email: user.email, role: user.role };
    const accessToken  = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.json({
      success: true,
      token:   accessToken,
      refreshToken,
      user: {
        id: user.id, uuid: user.uuid, email: user.email,
        first_name: user.first_name, last_name: user.last_name,
        role: user.role, avatar: user.avatar,
        email_verified: Boolean(user.email_verified),
      },
    });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/refresh
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token required' });
    }
    const decoded     = verifyRefreshToken(refreshToken);
    const accessToken = generateAccessToken({
      id: decoded.id, uuid: decoded.uuid, email: decoded.email, role: decoded.role,
    });
    res.json({ success: true, token: accessToken });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

// GET /api/auth/verify-email
const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: 'Token required' });

    const [rows] = await db.promise().query(
      'SELECT id FROM users WHERE email_verify_token = ?', [token]
    );
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    await db.promise().query(
      'UPDATE users SET email_verified = 1, email_verify_token = NULL WHERE id = ?',
      [rows[0].id]
    );

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const [rows] = await db.promise().query(
      'SELECT id, first_name FROM users WHERE email = ? AND is_active = 1', [email]
    );
    // Always return success to avoid user enumeration
    if (rows.length > 0) {
      const resetToken   = crypto.randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      await db.promise().query(
        'UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?',
        [resetToken, resetExpires, rows[0].id]
      );

      sendEmail({
        to:      email,
        subject: 'WildSmiles — Password Reset Request',
        template: 'reset-password',
        data: {
          name: rows[0].first_name,
          link: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
        },
      }).catch(console.error);
    }

    res.json({ success: true, message: 'If that email is registered, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;

    const [rows] = await db.promise().query(
      'SELECT id FROM users WHERE password_reset_token = ? AND password_reset_expires > NOW()',
      [token]
    );
    if (rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    const password_hash = await bcrypt.hash(password, 12);
    await db.promise().query(
      'UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?',
      [password_hash, rows[0].id]
    );

    res.json({ success: true, message: 'Password reset successfully. You can now log in.' });
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    const [rows] = await db.promise().query(
      `SELECT u.id, u.uuid, u.email, u.first_name, u.last_name, u.phone,
              u.avatar, u.role, u.email_verified, u.created_at,
              p.bio, p.nationality, p.country, p.city, p.total_trips
       FROM users u
       LEFT JOIN user_profiles p ON p.user_id = u.id
       WHERE u.id = ? AND u.is_active = 1`,
      [req.user.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, user: rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, refresh, verifyEmail, forgotPassword, resetPassword, getMe };
