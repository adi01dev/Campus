import express from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import Message from '../models/Message';
import User from '../models/User';

const router = express.Router();

// GET /api/messages/conversations
router.get('/conversations', authenticate, async (req: AuthRequest, res) => {
    try {
        const userId = req.user.id;

        // Find all messages involving the user
        const messages = await Message.find({
            $or: [{ sender: userId }, { recipient: userId }]
        }).populate('sender recipient', 'name role profileImage').sort({ createdAt: 1 });

        // Group by other participant
        const conversationsMap = new Map();

        messages.forEach(msg => {
            // Determine other participant
            const sender = msg.sender as any;
            const recipient = msg.recipient as any;

            const isSender = sender._id.toString() === userId;
            const otherUser = isSender ? recipient : sender;
            const otherId = otherUser._id.toString();

            if (!conversationsMap.has(otherId)) {
                conversationsMap.set(otherId, {
                    id: otherId,
                    participant: otherUser.name,
                    participantRole: otherUser.role,
                    unreadCount: 0,
                    messages: []
                });
            }

            const conv = conversationsMap.get(otherId);

            // Add message
            conv.messages.push({
                id: msg._id,
                sender: isSender ? 'You' : (otherUser as any).name,
                senderRole: isSender ? 'Student' : (otherUser as any).role, // Simple role fallback
                content: msg.content,
                timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                read: msg.read
            });

            // Update last message and unread count
            conv.lastMessage = msg.content;
            conv.timestamp = new Date(msg.createdAt).toLocaleString(); // Simplified
            if (!isSender && !msg.read) {
                conv.unreadCount++;
            }
        });

        res.json(Array.from(conversationsMap.values()));
    } catch (err) {
        console.error("Fetch messages error:", err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/messages/send
router.post('/send', authenticate, async (req: AuthRequest, res) => {
    try {
        const { recipientId, content } = req.body;

        const newMessage = new Message({
            sender: req.user.id,
            recipient: recipientId,
            content,
            read: false
        });

        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        console.error("Send message error:", err);
        res.status(500).json({ message: 'Failed to send message' });
    }
});

export default router;
