import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import { authenticate } from '../middlewares/auth';
import { requireRole } from '../middlewares/requireRole';


const router = express.Router();

/**
 * @desc Get all users (Admin only)
 * @route GET /api/admin/users
 */
router.get('/users', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const users = await User.find().select('-passwordHash -refreshToken -resetPasswordToken');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching users', error: err.message });
  }
});

/**
 * @desc Get single user by ID
 * @route GET /api/admin/users/:id
 */
router.get('/users/:id', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash -refreshToken');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: 'Error fetching user', error: err.message });
  }
});

/**
 * @desc Create Faculty or Student
 * @route POST /api/admin/users
 */
router.post('/users', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, department, semester, isMoUCoordinator } = req.body;

    if (!email || !password || !role)
      return res.status(400).json({ message: 'Email, password, and role are required' });

    // prevent duplicate
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already exists' });

    // hash password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      passwordHash,
      role,
      department,
      semester,
      isMoUCoordinator: role === 'Faculty' ? isMoUCoordinator || false : false,
    });

    await newUser.save();
    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (err: any) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

/**
 * @desc Update Faculty or Student details
 * @route PUT /api/admin/users/:id
 */
router.put('/users/:id', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const { name, email, department, semester, isMoUCoordinator, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, department, semester, isMoUCoordinator, role },
      { new: true }
    ).select('-passwordHash -refreshToken');

    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (err: any) {
    res.status(500).json({ message: 'Error updating user', error: err.message });
  }
});

/**
 * @desc Delete Faculty or Student
 * @route DELETE /api/admin/users/:id
 */
router.delete('/users/:id', authenticate, requireRole('Admin'), async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.role} deleted successfully` });
  } catch (err: any) {
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});




export default router;
