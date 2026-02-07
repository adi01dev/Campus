import express from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import Notification from '../models/Notification';

const router = express.Router();

// GET /api/notifications
router.get('/', authenticate, async (req: AuthRequest, res) => {
    try {
        const notifications = await Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

        // Format for frontend
        const formatted = notifications.map(n => ({
            id: n._id,
            title: n.title,
            message: n.message,
            type: n.type,
            timestamp: new Date(n.createdAt).toLocaleString(), // Better format needed?
            read: n.read
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Fetch notifications error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/notifications/:id/read
router.put('/:id/read', authenticate, async (req: AuthRequest, res) => {
    try {
        await Notification.findOneAndUpdate(
            { _id: req.params.id, recipient: req.user.id },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT /api/notifications/mark-all-read
router.put('/mark-all-read', authenticate, async (req: AuthRequest, res) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, read: false },
            { read: true }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
