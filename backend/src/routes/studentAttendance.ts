import express from "express";
import { authenticate } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import AttendanceSession from "../models/AttendanceSession";
import AttendanceRecord from "../models/AttendanceRecord";
import { verifyQRToken } from "../utils/qrToken";

const router = express.Router();

// 📱 Student scans QR → marks attendance
router.post("/mark", authenticate, requireRole("Student"), async (req, res) => {
  console.log("Decoded user:", req.user);
  try {
    const { qrToken } = req.body;
    if (!qrToken) return res.status(400).json({ message: "QR Token missing" });

    const decoded = verifyQRToken(qrToken) as any;
    const studentId = (req.user as any).id;

    const session = await AttendanceSession.findOne({
      qrToken,
      active: true,
      expiresAt: { $gt: new Date() },
    });
    if (!session) return res.status(400).json({ message: "Session expired or invalid" });

    const record = await AttendanceRecord.create({
      session: session._id,
      student: studentId,
      course: decoded.course,
    });

    res.json({ message: "Attendance marked successfully", record });
  } catch (err: any) {
    console.error("mark: ",err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already marked attendance" });
    }
    
    res.status(500).json({ message: err.message });
  }
});
export default router;
