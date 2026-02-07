import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Assignment from "../models/Assignment";
import { authenticate, AuthRequest } from "../middlewares/auth";
import { requireRole } from "../middlewares/requireRole";
import User from "../models/User";
import { createUploader } from "../middlewares/upload";

const router = express.Router();

// Initialize GridFS Uploader
const upload = createUploader("assignments");

// Interface for GridFS File
interface GridFSFile extends Express.Multer.File {
  filename: string;
  metadata: any;
  bucketName: string;
}

// Helper to get GridFS Bucket
const getBucket = () => {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"
  });
};

// 🎯 Faculty: Create Assignment
router.post("/", authenticate, requireRole("Faculty"), upload.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject, dueDate, totalMarks, instructions } = req.body;
    const { id: facultyId, department } = req.user;

    // 1. Basic Validation
    if (!title || !subject || !dueDate || !totalMarks) {
      return res.status(400).json({ message: "Please provide all required fields (Title, Subject, Due Date, Total Marks)." });
    }

    if (!department) {
      return res.status(400).json({ message: "Your profile is missing a Department. Please contact Admin or update your profile." });
    }

    // 2. Data Type Validation
    const parsedMarks = Number(totalMarks);
    if (isNaN(parsedMarks)) {
      return res.status(400).json({ message: "Total marks must be a valid number." });
    }

    // 3. Handle File Upload (Optional)
    let fileUrl, fileType, fileName;
    if (req.file) {
      fileUrl = `/api/assignments/files/${req.file.filename}`;
      fileType = (req.file.mimetype || "").split("/")[1] || "file";
      fileName = req.file.originalname;
    }

    const newAssignment = await Assignment.create({
      title,
      subject,
      department,
      faculty: facultyId,
      dueDate,
      totalMarks: parsedMarks,
      instructions,
      fileUrl,
      fileType,
      fileName
    });
    res.status(201).json(newAssignment);
  } catch (error: any) {
    console.error("Error creating assignment:", error); // Log the actual error
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: "Validation Error", error: error.message });
    }
    res.status(500).json({ message: "Failed to create assignment", error: error.message || error });
  }
});

// 📋 Get Assignments (Context-Aware)
router.get("/", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { role, id, department } = req.user;

    let filter: any = {};

    if (role === "Student") {
      filter.department = department;
    } else if (role === "Faculty") {
      filter.faculty = id;
    }

    const assignments = await Assignment.find(filter)
      .populate("faculty", "name")
      .sort({ createdAt: -1 })
      .lean(); // Use lean for better performance and modification

    if (role === "Student") {
      // Sanctify and transform for student
      const studentAssignments = assignments.map((assignment: any) => {
        // Find *this* student's submission
        const mySubmission = assignment.submissions?.find(
          (s: any) => s.studentId.toString() === id
        );

        let status = "pending";
        if (mySubmission) {
          status = "submitted";
        } else if (new Date(assignment.dueDate) < new Date()) {
          status = "overdue";
        }

        // Return sanitized object
        return {
          ...assignment,
          submissions: undefined, // Hide all submissions
          status,
          submittedOn: mySubmission ? mySubmission.submittedAt : null,
          mySubmission: mySubmission,
          grade: mySubmission?.grade || null,
          feedback: mySubmission?.feedback || null
        };
      });
      return res.json(studentAssignments);
    }

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

    // Store accessible URL for the file
    // For GridFS, we use the filename to stream it back
    const fileUrl = req.file ? `/api/assignments/files/${req.file.filename}` : undefined;

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
    console.error("Error submitting assignment:", error);
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

// 🗑️ Faculty: Delete Assignment
router.delete("/:id", authenticate, requireRole("Faculty"), async (req: AuthRequest, res: Response) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Ensure ownership
    if (assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this assignment" });
    }

    await assignment.deleteOne();
    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting assignment", error });
  }
});

// 🎓 Faculty: Grade Submission
router.post("/:id/submissions/:studentId/grade", authenticate, requireRole("Faculty"), async (req: AuthRequest, res: Response) => {
  try {
    const { grade, feedback } = req.body;
    const { id: assignmentId, studentId } = req.params;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Ensure Faculty Ownership
    if (assignment.faculty.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to grade this assignment" });
    }

    // Find submission
    const submission = assignment.submissions.find((s: any) => s.studentId.toString() === studentId);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found for this student" });
    }

    // Update grade
    submission.grade = Number(grade);
    submission.feedback = feedback || "";

    // Force Mongoose to detect change in subdocument array (if needed often happens)
    assignment.markModified('submissions');

    await assignment.save();

    res.json({ message: "Grade updated successfully", submission });
  } catch (error) {
    res.status(500).json({ message: "Error grading submission", error });
  }
});

// 📂 Serve Files (General Route for Assignments)
// This route is used to serve files uploaded via GridFS
// URL format: /api/assignments/files/:filename
router.get("/files/:filename", async (req: Request, res: Response) => {
  try {
    const bucket = getBucket();
    const filename = req.params.filename;

    // Determine content type based on extension
    const ext = path.extname(filename).toLowerCase();
    let contentType = "application/octet-stream";

    if (ext === ".pdf") contentType = "application/pdf";
    else if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    else if (ext === ".png") contentType = "image/png";

    const downloadStream = bucket.openDownloadStreamByName(filename);

    res.set("Content-Type", contentType);

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", (err) => {
      console.error("Stream error:", err);
      res.status(404).json({ message: "File not found" });
    });

    downloadStream.on("end", () => {
      res.end();
    });
  } catch (error) {
    console.error("File retrieval error:", error);
    res.status(500).json({ message: "Error retrieving file" });
  }
});

// Robust Submission Download (GET) - Backward compatibility / Specific logic
router.get("/:id/submissions/:studentId/download", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const { id: assignmentId, studentId } = req.params;
    const { id: userId, role } = req.user;

    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    // Security check: Only faculty (owner) or the student themselves can download
    const isOwner = assignment.faculty.toString() === userId;
    const isStudent = studentId === userId;

    if (!isOwner && !isStudent && role !== "Admin") {
      return res.status(403).json({ message: "Unauthorized download access" });
    }

    const submission = assignment.submissions.find((s: any) => s.studentId.toString() === studentId);
    if (!submission || !submission.fileUrl) {
      return res.status(404).json({ message: "Submission file not found" });
    }

    const fileUrl = submission.fileUrl;
    let filename = path.basename(fileUrl);

    // Let's try GridFS first.
    const bucket = getBucket();

    const downloadStream = bucket.openDownloadStreamByName(filename);

    // Ensure extension is present
    if (!path.extname(filename)) {
      // basic inference if missing
      // This is harder for assignments as we don't store fileType explicitly, 
      // but often the filename from student upload has it.
      // If not, it might download without extension.
    }

    res.set('Content-Disposition', `attachment; filename="${filename}"`);
    res.set('Access-Control-Expose-Headers', 'Content-Disposition'); // Crucial for frontend to read it

    downloadStream.pipe(res)
      .on('error', (err) => {
        // Fallback to local file system for legacy files
        const localPath = path.join(process.cwd(), "uploads", "assignments", filename);
        if (fs.existsSync(localPath)) {
          res.download(localPath, filename);
        } else {
          res.status(404).json({ message: "File not found" });
        }
      });

  } catch (error) {
    console.error("Download route caught error:", error);
    res.status(500).json({ message: "Error downloading submission", error });
  }
});

export default router;
