import express from 'express';
import { authenticate, AuthRequest } from '../middlewares/auth';
import LectureSchedule from '../models/LectureSchedule';
import Assignment from '../models/Assignment';
import Query from '../models/Query';
import User from '../models/User';
import Goal from '../models/Goal';
import AttendanceRecord from '../models/AttendanceRecord';
import Notification from '../models/Notification';
import Message from '../models/Message';
import { requireRole } from '../middlewares/requireRole';

const router = express.Router();

// GET /api/dashboard/stats
router.get('/stats', authenticate, async (req: AuthRequest, res) => {
    try {
        const { role, id, subjects, department, semester } = req.user;
        // Fetch fresh user data to ensure latest department is used
        const currentUser = await User.findById(id);
        const currentDepartment = currentUser?.department || department;

        let stats: any = {};

        if (role === 'Faculty') {
            stats.coursesTeaching = subjects?.length || 0;
            stats.totalStudents = await User.countDocuments({ role: 'Student', department: currentDepartment });
            stats.pendingQueries = await Query.countDocuments({
                course: { $in: subjects || [] },
                status: 'open'
            });
            stats.assignmentsToReview = await Assignment.countDocuments({
                creator: id,
                // Check if there are submissions that are not graded (hypothetically)
                // For now just count all assignments created by this faculty
            });


            // 1. Classes Today
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            stats.classesToday = await LectureSchedule.countDocuments({
                department,
                semester,
                dayOfWeek: today
            });

            // 2. Pending Assignments
            // Find assignments for dept/sem where due date is in future AND student has NOT submitted
            const now = new Date();
            // Reset time to start of day for fairer comparison if needed, but 'now' is fine for strict deadlines

            const assignments = await Assignment.find({
                department,
                $or: [{ semester: semester }, { semester: { $exists: false } }] // Handle optional semester
            });

            // Filter in memory 
            const pendingCount = assignments.filter(a => {
                const dueDate = new Date(a.dueDate);
                const isDue = dueDate >= now;
                const submitted = a.submissions.some(s => s.studentId === id);
                return isDue && !submitted;
            }).length;

            stats.assignmentsPending = pendingCount;

            // 4. Overall Attendance
            stats.overallAttendance = "87%";

            // 5. Quick Actions Data

            // Next Live Class Logic
            // Find class today where startTime > now
            const currentTime = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' });

            let nextClass = await LectureSchedule.findOne({
                department,
                semester,
                dayOfWeek: today,
                startTime: { $gt: currentTime }
            }).sort({ startTime: 1 });

            if (!nextClass) {
                // If no more classes today, find first class of tomorrow (simplified)
                // In real app, we'd look for next day, but for "Join Live" usually implies today/now.
                // We'll just return null or upcoming logic.
            }

            // Check if there is a class RIGHT NOW (live)
            // startTime <= now < endTime
            const liveClass = await LectureSchedule.findOne({
                department,
                semester,
                dayOfWeek: today,
                startTime: { $lte: currentTime },
                endTime: { $gt: currentTime }
            });

            stats.quickActions = {
                liveClass: liveClass ? {
                    id: liveClass._id,
                    title: liveClass.course,
                    time: "Now",
                    isLive: true,
                    link: liveClass.meetingLink || "#"
                } : nextClass ? {
                    id: nextClass._id,
                    title: nextClass.course,
                    time: `Starts at ${nextClass.startTime}`,
                    isLive: false,
                    link: nextClass.meetingLink || "#"
                } : null,
                assignmentsPending: pendingCount,
                activeGoals: await Goal.countDocuments({ student: id, status: 'In Progress' })
            };
        } else if (role === 'Student') {
            const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
            stats.classesToday = await LectureSchedule.countDocuments({
                department: currentDepartment,
                semester,
                dayOfWeek: today
            });

            const now = new Date();
            const assignments = await Assignment.find({
                department: currentDepartment,
                $or: [{ semester: semester }, { semester: { $exists: false } }]
            });

            const pendingCount = assignments.filter(a => {
                const dueDate = new Date(a.dueDate);
                return dueDate >= now && !a.submissions.some(s => s.studentId === id);
            }).length;

            stats.assignmentsPending = pendingCount;
            stats.notificationsCount = await Notification.countDocuments({ recipient: id, read: false });
            stats.messagesCount = await Message.countDocuments({ recipient: id, read: false });
            stats.feeStatus = 'Due';
            stats.aiNew = true;
        }

        res.json(stats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/dashboard/queries
router.get('/queries', authenticate, requireRole('Faculty'), async (req: AuthRequest, res) => {
    try {
        const queries = await Query.find({
            // Assuming faculty can see queries related to their courses or addressed to them
            // For now, simpler: addressed to them or in their subjects
            $or: [
                { facultyId: req.user.id },
                { course: { $in: req.user.subjects || [] } }
            ]
        })
            .sort({ createdAt: -1 })
            .limit(5);

        // Format for UI
        const formattedQueries = queries.map(q => ({
            id: q._id,
            student: q.studentName,
            query: q.queryText,
            course: q.course,
            time: new Date(q.createdAt).toLocaleString(), // improved formatting on frontend usually better
            urgent: q.urgent
        }));

        res.json(formattedQueries);
    } catch (err) {
        console.error("Fetch queries error:", err);
        res.status(500).json({ message: "Failed to fetch queries" });
    }
});

// GET /api/dashboard/performance
router.get('/performance', authenticate, requireRole('Faculty'), async (req: AuthRequest, res) => {
    try {
        const { subjects } = req.user;
        if (!subjects || subjects.length === 0) {
            return res.json([]);
        }

        const performanceData = [];

        for (const course of subjects) {
            // 1. Calculate Attendance % for this course
            // Get all records for this course
            const records = await AttendanceRecord.find({ courseId: course }); // Assuming course name stored in courseId or similar
            // This is tricky without strict relational linking.
            // Let's assume 'course' field in AttendanceRecord matches 'subjects' string.

            // Mocking calculation for now as accurate aggregate requires complex query
            const totalRecords = await AttendanceRecord.countDocuments({ courseId: course });
            const presentRecords = await AttendanceRecord.countDocuments({ courseId: course, status: 'Present' });

            const attendance = totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 100) : 0;

            // 2. Calculate Avg Score
            // Find assignments for this course
            const assignments = await Assignment.find({ subject: course });
            let totalScore = 0;
            let gradedCount = 0;

            assignments.forEach(a => {
                a.submissions.forEach((s: any) => {
                    if (s.grade) {
                        // grade might be "A", "90", etc. parsing needed.
                        // Assuming numeric or convertible
                        const score = parseFloat(s.grade);
                        if (!isNaN(score)) {
                            totalScore += score;
                            gradedCount++;
                        }
                    }
                });
            });

            const avgScore = gradedCount > 0 ? Math.round(totalScore / gradedCount) : 0;

            performanceData.push({
                course,
                attendance: attendance > 0 ? attendance : 85, // Fallback for demo if 0
                avgScore: avgScore > 0 ? avgScore : 78, // Fallback for demo
                assignments: assignments.length
            });
        }

        res.json(performanceData);

    } catch (err) {
        console.error("Fetch performance error:", err);
        res.status(500).json({ message: "Failed to fetch performance stats" });
    }
});

// GET /api/dashboard/schedule?day=Monday
router.get('/schedule', authenticate, async (req: AuthRequest, res) => {
    try {
        const { day } = req.query;
        const { role, id, department, semester } = req.user;

        // Build filter
        let filter: any = {};

        // If 'day' is provided, filter by it. If not, return ALL (for weekly view).
        if (day && day !== 'all') {
            filter.dayOfWeek = day;
        }

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
        const { course, department, semester, room, type, dayOfWeek, startTime, endTime, meetingLink } = req.body;

        const newClass = await LectureSchedule.create({
            facultyId: req.user.id,
            facultyName: req.user.name,
            course, department, semester, room, type, dayOfWeek, startTime, endTime, meetingLink
        });

        res.status(201).json(newClass);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});



export default router;
