import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Assignment from "../models/Assignment";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import User from "../models/User";

const router = express.Router();

// Create uploads directory
const uploadDir = path.join(process.cwd(), "uploads", "assignments");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// 🎯 Faculty: Create Assignment
router.post("/", authenticate, requireRole("Faculty"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, dueDate, totalMarks, instructions } = req.body;
    const { id: facultyId, department } = req.user;

    const newAssignment = await Assignment.create({
      title,
      subject,
      department,
      faculty: facultyId,
      dueDate,
      totalMarks,
      instructions,
    });
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error });
  }
});

// 📋 Get Assignments (Context-Aware)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role, id, department } = req.user;

    let filter: any = {};

    if (role === "Student") {
      // Students see assignments for their Department
      filter.department = department;
      // Optional: Filter by semester if needed, but for now show all Dept assignments
    } else if (role === "Faculty") {
      // Faculty see their own created assignments
      filter.faculty = id;
    }
    // Admin sees all (empty filter)

    const assignments = await Assignment.find(filter)
      .populate("faculty", "name")
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
});

// 🔍 Student: Get Sync Data (Faculty Maps)
// Returns list of faculty + subjects for the student's department
router.get("/sync-map", authenticate, requireRole("Student"), async (req: AuthRequest, res: Response) => {
  try {
    const { department } = req.user;
    const facultyMembers = await User.find({
      role: "Faculty",
      department
    }).select("name subjects email");

    res.json(facultyMembers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sync map", error });
  }
});

// 📘 Get Single Assignment
router.get("/:id", authenticate, async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id).populate("faculty", "name");
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignment", error });
  }
});

// 🧑‍🎓 Student: Submit Assignment
router.post("/:id/submit", authenticate, requireRole("Student"), upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { submissionText, linkUrl } = req.body;
    const { id: studentId, name: studentName } = req.user;

    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : undefined;

    // Check if already submitted? (Optional, skipping for now to allow re-uploads)

    assignment.submissions.push({
      studentName,
      studentId,
      fileUrl,
      submissionText,
      linkUrl,
      submittedAt: new Date(),
    });

    await assignment.save();
    res.status(201).json({ message: "Submission successful", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error submitting assignment", error });
  }
});

// 🧾 Faculty: Get Submissions
router.get("/:id/submissions", authenticate, requireRole("Faculty"), async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    // Security: Only owner faculty can view
    if (assignment?.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access to these submissions" });
    }

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment.submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error });
  }
});


export default router;
