import express, { Request, Response } from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import Goal from '../models/Goal';

const router = express.Router();

/**
 * GET /api/goals
 * Fetch all goals for the logged-in student
 */
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const goals = await Goal.find({ student: req.user.id }).sort({ createdAt: -1 });
        res.json(goals);
    } catch (err) {
        console.error("Error fetching goals:", err);
        res.status(500).json({ message: 'Error fetching goals' });
    }
});

/**
 * GET /api/goals/stats
 * Fetch goal statistics (Active, Completed, Next Deadline)
 */
router.get('/stats', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const studentId = req.user.id;

        const totalGoals = await Goal.countDocuments({ student: studentId });
        const completedGoals = await Goal.countDocuments({ student: studentId, status: 'Completed' });
        const activeGoals = totalGoals - completedGoals;

        // Find nearest deadline for active goals
        const nearestGoal = await Goal.findOne({
            student: studentId,
            status: { $ne: 'Completed' },
            deadline: { $gte: new Date() }
        }).sort({ deadline: 1 });

        let daysToFinals = 0;
        if (nearestGoal && nearestGoal.deadline) {
            const today = new Date();
            const diffTime = Math.abs(new Date(nearestGoal.deadline).getTime() - today.getTime());
            daysToFinals = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        }

        res.json({
            active: activeGoals,
            completed: completedGoals,
            daysToNextDeadline: daysToFinals,
            nextDeadlineLabel: nearestGoal ? nearestGoal.title : "No upcoming deadlines"
        });

    } catch (err) {
        console.error("Error fetching goal stats:", err);
        res.status(500).json({ message: 'Error fetching stats' });
    }
});

/**
 * POST /api/goals
 * Create a new goal
 */
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { title, targetValue, deadline } = req.body;

        if (!title || !targetValue) {
            return res.status(400).json({ message: "Title and target value are required" });
        }

        const goal = await Goal.create({
            student: req.user.id,
            title,
            targetValue,
            currentValue: 0,
            deadline,
            status: 'In Progress'
        });
        res.status(201).json(goal);
    } catch (err) {
        console.error("Error creating goal:", err);
        res.status(500).json({ message: 'Error creating goal' });
    }
});

/**
 * PUT /api/goals/:id
 * Update a goal (progress, status)
 */
router.put('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const { currentValue, status } = req.body;
        const goal = await Goal.findOne({ _id: req.params.id, student: req.user.id });

        if (!goal) return res.status(404).json({ message: 'Goal not found' });

        if (currentValue !== undefined) goal.currentValue = currentValue;
        if (status !== undefined) goal.status = status;

        // Auto-update status if completed
        if (currentValue !== undefined && goal.targetValue) {
            const progress = (Number(currentValue) / Number(goal.targetValue)) * 100;
            if (progress >= 100 && goal.status !== 'Completed') {
                goal.status = 'Completed';
            }
        }

        await goal.save();
        res.json(goal);
    } catch (err) {
        console.error("Error updating goal:", err);
        res.status(500).json({ message: 'Error updating goal' });
    }
});

/**
 * DELETE /api/goals/:id
 * Delete a goal
 */
router.delete('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const goal = await Goal.findOneAndDelete({ _id: req.params.id, student: req.user.id });
        if (!goal) return res.status(404).json({ message: 'Goal not found' });
        res.json({ message: 'Goal deleted' });
    } catch (err) {
        console.error("Error deleting goal:", err);
        res.status(500).json({ message: 'Error deleting goal' });
    }
});

export default router;
