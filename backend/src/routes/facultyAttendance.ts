import express from "express";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import AttendanceSession from "../models/AttendanceSession";
import AttendanceRecord from "../models/AttendanceRecord";

import { generateQRToken } from "../utils/qrToken";

const router = express.Router();

// 🎯 Create attendance session (faculty)
router.post("/create-session", authenticate, requireRole("Faculty"), async (req, res) => {
    console.log("xyz");
  try {
    // NOTE: your authenticate middleware must attach req.user
    const facultyId = (req.user as any)?._id || (req.user as any)?.id;
    if (!facultyId) return res.status(401).json({ message: "Unauthenticated" });

    const { course, sessionType, duration } = req.body;
    if (!course) return res.status(400).json({ message: "Course required" });

    const durationMinutes = parseInt(duration) || 5;
    const expiresAt = new Date(Date.now() + durationMinutes * 60 * 1000);

    // generate token valid for the chosen duration
    const qrToken = generateQRToken({ facultyId, course, sessionType }, `${durationMinutes}m`);

    const session = await AttendanceSession.create({
      faculty: facultyId,
      course,
      sessionType: sessionType || "Lecture",
      qrToken,
      expiresAt,
      active: true,
    });

    res.json({
      message: "QR session created",
      session: {
        id: session._id,
        course: session.course,
        sessionType: session.sessionType,
        qrToken: session.qrToken,
        expiresAt: session.expiresAt,
      },
    });
  } catch (err: any) {
    console.error("create-session error:", err);
    res.status(500).json({ message: "Error creating session" });
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
