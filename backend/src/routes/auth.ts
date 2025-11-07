import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import User from '../models/User';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { authenticate, AuthRequest } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();
const SALT_ROUNDS = 10;

/**
 * POST /api/auth/login
 * body: { email, password }
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) return res.status(400).json({ message: 'Email, role and password required' });

    const user = await User.findOne({ email, role });
    if (!user || !user.passwordHash || !role) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role, email: user.email, name: user.name };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken({ id: user._id });

    // persist refresh token
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/refresh
 * body: { refreshToken }
 */
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken) as any;
    } catch (e) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ message: 'Refresh token invalidated' });
    }

    const payload = { id: user._id, role: user.role, email: user.email, name: user.name };
    const accessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken({ id: user._id });

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({ accessToken, refreshToken: newRefreshToken, user: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * POST /api/auth/logout
 * body: { refreshToken }
 * invalidates refresh token in DB
 */
router.post('/logout', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    let decoded: any;
    try {
      decoded = verifyRefreshToken(refreshToken) as any;
    } catch {
      // even if invalid, respond OK to avoid token fishing
      return res.json({ message: 'Logged out' });
    }
    const user = await User.findById(decoded.id);
    if (user) {
      user.refreshToken = null;
      await user.save();
    }
    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Admin route to create a user
 * POST /api/auth/admin/create-user
 * body: { name, email, role, department, isMoUCoordinator, password? }
 */
router.post('/admin/create-user', authenticate, requireRole('Admin'), async (req: AuthRequest, res) => {
  try {
    const { name, email, role, department, isMoUCoordinator, password } = req.body;
    if (!name || !email || !role) return res.status(400).json({ message: 'name, email, role required' });
    if (!['Admin', 'Faculty', 'Student'].includes(role)) return res.status(400).json({ message: 'Invalid role' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    const plainPassword = password || Math.random().toString(36).slice(2, 10) + 'A1!';
    const hash = await bcrypt.hash(plainPassword, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      passwordHash: hash,
      role,
      department: department || null,
      isMoUCoordinator: !!isMoUCoordinator
    });
    await newUser.save();

    // Return the plaintext initial password in the response so admin can record/send it.
    // In production, you'd email or otherwise securely deliver this.
    return res.status(201).json({ message: 'User created', user: { id: newUser._id, name, email, role }, initialPassword: plainPassword });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Authenticated route for changing password (old + new)
 * POST /api/auth/change-password
 * body: { oldPassword, newPassword }
 */
router.post('/change-password', authenticate, async (req: AuthRequest, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: 'oldPassword and newPassword required' });

    const user = await User.findById(req.user.id);
    if (!user || !user.passwordHash) return res.status(404).json({ message: 'User not found or has no password set' });

    const match = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Old password incorrect' });

    const newHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = newHash;
    await user.save();

    return res.json({ message: 'Password changed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Request password reset: creates reset token (returns token in response).
 * POST /api/auth/request-password-reset
 * body: { email }
 */
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'email required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(200).json({ message: 'If account exists, reset token created (check response for token in dev)' });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpiresAt = expiresAt;
    await user.save();

    // In production: send this token via email. For local dev, we return it.
    return res.json({ message: 'Reset token generated (dev mode)', resetToken: token, expiresAt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * Reset password using reset token
 * POST /api/auth/reset-password
 * body: { token, newPassword }
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) return res.status(400).json({ message: 'token and newPassword required' });

    const user = await User.findOne({ resetPasswordToken: token });
    if (!user) return res.status(400).json({ message: 'Invalid token' });
    if (!user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Token expired' });
    }

    const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
    user.passwordHash = hash;
    user.resetPasswordToken = null;
    user.resetPasswordExpiresAt = null;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
