import express from 'express';
import { authenticate } from '../middleware/auth';
import { requireRole } from '../middleware/requireRole';
import Class from '../models/Class';
import Query from '../models/Query';
import Performance from '../models/Performance';
import Assignment from '../models/Assignment';
import AttendanceSession from '../models/AttendanceSession';

const router = express.Router();

// 1. Get quick stats
router.get('/dashboard/quick-stats', authenticate, requireRole('Faculty'), async (req, res) => {
  try {
    const facultyId = (req.user as any).id;
    // fetch counts
    const coursesCount = await Class.countDocuments({ faculty: facultyId });
    const studentsTotal = await Class.aggregate([
      { $match: { faculty: facultyId } },
      { $group: { _id: null, total: { $sum: '$studentsCount' } } }
    ]);
    const queriesPending = await Query.countDocuments({ faculty: facultyId, status: 'pending' });
    const assignmentsPending = await Assignment.countDocuments({ faculty: facultyId, status: 'pending' });

    res.json({
      coursesTeaching: coursesCount,
      totalStudents: studentsTotal.length ? studentsTotal[0].total : 0,
      pendingQueries: queriesPending,
      assignmentsToReview: assignmentsPending
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Get today’s classes
router.get('/dashboard/todays-classes', authenticate, requireRole('Faculty'), async (req, res) => {
  try {
    const facultyId = (req.user as any).id;
    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    const classes = await Class.find({
      faculty: facultyId,
      scheduleDateTime: { $gte: startOfDay, $lte: endOfDay }
    }).select('time courseName room type studentsCount');
    res.json(classes);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Get student queries
router.get('/dashboard/queries', authenticate, requireRole('Faculty'), async (req, res) => {
  try {
    const facultyId = (req.user as any).id;
    const queries = await Query.find({ faculty: facultyId }).select('student question course time urgent status');
    res.json(queries);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Get class performance
router.get('/dashboard/performance', authenticate, requireRole('Faculty'), async (req, res) => {
  try {
    const facultyId = (req.user as any).id;
    const performance = await Performance.find({ faculty: facultyId }).select('course attendancePercentage avgScore assignmentsCount');
    res.json(performance);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Create attendance session (generate QR etc)
router.post('/attendance/session', authenticate, requireRole('Faculty'), async (req, res) => {
  try {
    const { course } = req.body;
    const facultyId = (req.user as any).id;
    const sessionId = Date.now().toString(); // or better generate uuid
    const session = await AttendanceSession.create({
      faculty: facultyId,
      course,
      qrCodeSessionId: sessionId,
      studentsMarked: []
    });
    res.json({ sessionId, session });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});
export default router;
