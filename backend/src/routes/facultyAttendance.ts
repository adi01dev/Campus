import express from "express";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import AttendanceSession from "../models/AttendanceSession";
import AttendanceRecord from "../models/AttendanceRecord";

import { generateQRToken } from "../utils/qrToken";

const router = express.Router();

// 🎯 Create attendance session (faculty)
router.post("/create-session", authenticate, requireRole("Faculty"), async (req: AuthRequest, res) => {
  console.log("xyz");
  try {
    // NOTE: your authenticate middleware must attach req.user
    const facultyId = req.user.id;
    if (!facultyId) return res.status(401).json({ message: "Unauthenticated" });

    const { course, sessionType, duration } = req.body;
    if (!course) return res.status(400).json({ message: "Course required" });

    const durationMinutes = parseInt(duration) || 5;
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    const secret = require("crypto").randomBytes(32).toString("hex");

    const session = await AttendanceSession.create({
      faculty: facultyId,
      course,
      sessionType: sessionType || "Lecture",
      qrToken: "DYNAMIC_CLIENT_SIDE", // Placeholder
      secret,
      expiresAt,
      active: true,
    });

    res.json({
      message: "QR session created",
      session: {
        id: session._id,
        course: session.course,
        sessionType: session.sessionType,
        secret: session.secret, // Send secret to client
        expiresAt: session.expiresAt,
      },
    });
  } catch (err: any) {
    console.error("create-session error:", err);
    res.status(500).json({ message: "Error creating session" });
  }
});

// 📅 Get today's sessions (from LectureSchedule)
router.get("/todays-sessions", authenticate, requireRole("Faculty"), async (req: AuthRequest, res) => {
  try {
    const facultyId = req.user.id;
    const today = new Date();
    const dayOfWeek = today.toLocaleDateString("en-US", { weekday: "long" });

    // Fetch schedules for today
    // Note: You might need to import LectureSchedule model if not already imported
    const LectureSchedule = require("../models/LectureSchedule").default;
    const schedules = await LectureSchedule.find({ facultyId, dayOfWeek });

    // Enrich with live attendance data if a session is active
    const enhancedSessions = await Promise.all(schedules.map(async (sch: any) => {
      // Check if there's an active session for this course today
      const startOfDay = new Date(today.setHours(0, 0, 0, 0));
      const endOfDay = new Date(today.setHours(23, 59, 59, 999));

      const activeSession = await AttendanceSession.findOne({
        faculty: facultyId,
        course: sch.course,
        createdAt: { $gte: startOfDay, $lte: endOfDay }
      });

      let presentCount = 0;
      let status = "upcoming";

      if (activeSession) {
        status = activeSession.active ? "ongoing" : "completed";
        presentCount = await AttendanceRecord.countDocuments({ session: activeSession._id });
      }

      return {
        id: sch._id,
        subject: sch.course,
        time: `${sch.startTime} - ${sch.endTime}`,
        room: sch.room,
        faculty: sch.facultyName,
        totalStudents: sch.studentsCount || 60, // Default if not set
        present: presentCount,
        status,
        sessionId: activeSession?._id
      };
    }));

    res.json(enhancedSessions);
  } catch (err: any) {
    console.error("Error fetching today's sessions:", err);
    res.status(500).json({ message: "Error fetching sessions" });
  }
});

// 🔴 Get live attendance for a session
router.get("/active-session/:sessionId/live", authenticate, requireRole("Faculty"), async (req, res) => {
  try {
    const { sessionId } = req.params;
    const records = await AttendanceRecord.find({ session: sessionId })
      .populate("student", "name rollNumber")
      .sort({ markedAt: -1 });

    res.json(records.map(r => ({
      student: (r.student as any).name,
      rollNo: (r.student as any).rollNumber || "N/A",
      time: new Date(r.markedAt).toLocaleTimeString(),
      status: r.verificationStatus
    })));
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching live attendance" });
  }
});

// 🛠️ Manual Mark (Simulation)
router.post("/mark-manual", authenticate, requireRole("Faculty"), async (req, res) => {
  try {
    const { sessionId, studentId } = req.body;

    // Check if session exists
    const session = await AttendanceSession.findById(sessionId);
    if (!session) return res.status(404).json({ message: "Session not found" });

    // Check if already marked
    const existing = await AttendanceRecord.findOne({ session: sessionId, student: studentId });
    if (existing) return res.status(400).json({ message: "Already present" });

    // Create record
    await AttendanceRecord.create({
      session: sessionId,
      student: studentId,
      course: session.course,
      scanDelay: 0,
      qrId: `MANUAL_${Date.now()}`,
      verificationStatus: "verified"
    });

    res.json({ message: "Marked successfully" });
  } catch (err: any) {
    res.status(500).json({ message: "Error marking attendance" });
  }
});

// 🧾 Get attendance records for a course
router.get("/records/:course", authenticate, requireRole("Faculty"), async (req, res) => {
  try {
    const { course } = req.params;
    const records = await AttendanceRecord.find({ course }).populate("student", "name email");
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ message: "Error fetching records" });
  }
});

export default router;
