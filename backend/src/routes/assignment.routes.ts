import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Assignment from "../models/Assignment";

const router = express.Router();

// Create uploads directory if not exists
const uploadDir = path.join(process.cwd(), "uploads", "assignments");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")),
});
const upload = multer({ storage });

// ✅ Create a new assignment
router.post("/", async (req: Request, res: Response) => {
  try {
    const { title, course, dueDate, totalMarks, instructions, submissionType } = req.body;
    const newAssignment = await Assignment.create({
      title,
      course,
      dueDate,
      totalMarks,
      instructions,
      submissionType,
    });
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(500).json({ message: "Failed to create assignment", error });
  }
});

// 📋 Get all assignments
router.get("/", async (_req: Request, res: Response) => {
  try {
    const assignments = await Assignment.find().sort({ createdAt: -1 });
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
});

// 📘 Get a single assignment (with submissions)
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignment", error });
  }
});

// 🧑‍🎓 Submit assignment
router.post("/:id/submit", upload.single("file"), async (req: Request, res: Response) => {
  try {
    const { studentName, studentId, submissionText, linkUrl } = req.body;
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    const fileUrl = req.file ? `/uploads/assignments/${req.file.filename}` : undefined;

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

// 🧾 Get all submissions for an assignment
router.get("/:id/submissions", async (req: Request, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });
    res.json(assignment.submissions);
  } catch (error) {
    res.status(500).json({ message: "Error fetching submissions", error });
  }
});

export default router;
