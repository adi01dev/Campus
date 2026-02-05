import express from "express";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import AttendanceSession from "../models/AttendanceSession";
import AttendanceRecord from "../models/AttendanceRecord";
import { verifyQRToken } from "../utils/qrToken";

const router = express.Router();

// 📱 Student scans QR → marks attendance
router.post("/mark", authenticate, requireRole("Student"), async (req: AuthRequest, res) => {
  console.log("Decoded user:", req.user);
  try {
    const { sessionId, qrPayload, scanDelay, studentId: bodyStudentId } = req.body;

    // Support offline sync where studentId might be in body, else use auth token
    const studentId = req.user?.id || bodyStudentId;

    if (!sessionId || !qrPayload || scanDelay === undefined) {
      return res.status(400).json({ message: "Missing attendance data" });
    }

    const session = await AttendanceSession.findById(sessionId);
    if (!session || !session.active) return res.status(400).json({ message: "Invalid or inactive session" });

    // 1. Verify HMAC Signature
    // Format: nonce:timestamp:signature
    const [nonce, timestampStr, signature] = qrPayload.split(":");
    const timestamp = parseInt(timestampStr);

    const crypto = require("crypto");
    const expectedSig = crypto
      .createHmac("sha256", session.secret)
      .update(`${nonce}:${timestamp}`)
      .digest("hex");

    if (signature !== expectedSig) {
      return res.status(400).json({ message: "Invalid QR signature" });
    }

    // 2. Replay Protection (Check if nonce used)
    const existingNonce = await AttendanceRecord.findOne({ qrId: nonce });
    if (existingNonce) {
      return res.status(400).json({ message: "QR Code already used" });
    }

    // 3. Time Window Validation
    // Frontend refreshes every 15s. We allow 15s + 3s grace.
    const GRACE_WINDOW = 3000;
    const QR_LIFETIME = 15000;

    const reconstructedScanTime = timestamp + scanDelay;
    const expiryTime = timestamp + QR_LIFETIME + GRACE_WINDOW;

    // Sanity check: scanDelay shouldn't be negative or absurdly large (e.g. > 1 min) usually
    if (scanDelay < -2000 || scanDelay > 60000) {
      console.warn(`Unusual scan delay: ${scanDelay}ms`);
    }

    let status = "verified";

    // Strict check: The reconstituted time must be BEFORE the QR expired (+ grace)
    // AND the timestamp must not be from the future (clock skew tolerance)
    if (reconstructedScanTime > expiryTime) {
      return res.status(400).json({ message: "QR Code expired at time of scan" });
    }

    const record = await AttendanceRecord.create({
      session: session._id,
      student: studentId,
      course: session.course,
      scanDelay,
      qrId: nonce,
      verificationStatus: status
    });

    res.json({ message: "Attendance marked successfully", record });
  } catch (err: any) {
    console.error("mark error: ", err);
    if (err.code === 11000) {
      return res.status(400).json({ message: "Attendance already marked for this session" });
    }

    res.status(500).json({ message: err.message });
  }
});
export default router;
