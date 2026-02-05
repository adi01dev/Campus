import express from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import LectureSchedule from '../models/LectureSchedule';
import Assignment from '../models/Assignment';
import Query from '../models/Query';
import User from '../models/User';
import { requireRole } from '../middlewares/requireRole';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
    try {
        const { role, id, subjects, department, semester } = req.user;
        const stats: any = {};

        if (role === 'Faculty') {
            stats.coursesTeaching = subjects?.length || 0;
            // Count students in the department as a proxy for total students
            stats.totalStudents = await User.countDocuments({ role: 'Student', department: department });
            stats.pendingQueries = await Query.countDocuments({
                course: { $in: subjects || [] },
                status: 'open'
            });
            stats.assignmentsToReview = await Assignment.countDocuments({
                creator: id
            });

        } else if (role === 'Student') {
            // Student Stats
            stats.enrolledCourses = 6; // Fixed for now, or count from LectureSchedule unique courses

            // Count today's classes
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            stats.classesToday = await LectureSchedule.countDocuments({
                department,
                semester,
                dayOfWeek: today
            });

            stats.assignmentsPending = await Assignment.countDocuments({
                department,
                status: 'Active' // Simplification
            });

            stats.overallGrade = "85%"; // Placeholder
        }

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/dashboard/schedule?day=Monday
router.get('/schedule', authenticate, async (req: AuthRequest, res) => {
    try {
        const { day } = req.query;
        const { role, id, department, semester } = req.user;

        // Default to today if no day provided
        const queryDay = day || new Date().toLocaleDateString('en-US', { weekday: 'long' });

        let filter: any = { dayOfWeek: queryDay };

        if (role === 'Faculty') {
            filter.facultyId = id;
        } else if (role === 'Student') {
            filter.department = department;
            filter.semester = semester;
        }

        const schedule = await LectureSchedule.find(filter).sort({ startTime: 1 });
        res.json(schedule);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/dashboard/schedule (Admin/Faculty to add class)
router.post('/schedule', authenticate, requireRole('Faculty'), async (req: AuthRequest, res) => {
    try {
        // Faculty can add their own class
        const { course, department, semester, room, type, dayOfWeek, startTime, endTime } = req.body;

        const newClass = await LectureSchedule.create({
            facultyId: req.user.id,
            facultyName: req.user.name,
            course, department, semester, room, type, dayOfWeek, startTime, endTime
        });

        res.status(201).json(newClass);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
