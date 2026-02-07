import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Material from "../models/Material";
import { createUploader } from "../middlewares/upload";
import { authenticate, AuthRequest } from "../middlewares/auth";

const router = express.Router();
const uploader = createUploader("materials");

// Helper to get GridFS Bucket
const getBucket = () => {
  return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: "uploads"
  });
};

// Post new material (Faculty only, but checking auth generally here)
router.post("/upload", authenticate, uploader.single("file"), async (req: AuthRequest, res: Response) => {
  try {
    const { courseCode, title, description, subject, type } = req.body; // 'subject' from frontend maps to courseCode likely, or we store both

    if (!req.file) return res.status(400).json({ message: "File required" });

    // GridFS returns file details in req.file
    // We construct a URL that points to our streaming endpoint
    const fileUrl = `/api/materials/files/${req.file.filename}`;
    const fileType = (req.file.mimetype || "").split("/")[1] || "file";
    const fileSize = req.file.size; // Get file size from multer

    // Use logged in user's name
    const uploadedBy = req.user?.name || "Unknown Faculty";

    const material = await Material.create({
      courseCode: subject || courseCode, // specific to frontend 'subject' field
      title,
      description,
      fileUrl,
      fileType: type || fileType, // Use selected type from frontend if available
      fileSize,
      uploadedBy,
      uploadedAt: new Date(),
      downloads: 0,
      views: 0
    });

    res.status(201).json(material);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get statistics
router.get("/stats", authenticate, async (req: Request, res: Response) => {
  try {
    const totalMaterials = await Material.countDocuments();

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const thisWeek = await Material.countDocuments({ uploadedAt: { $gte: oneWeekAgo } });

    const aggregation = await Material.aggregate([
      {
        $group: {
          _id: null,
          totalDownloads: { $sum: "$downloads" },
          totalViews: { $sum: "$views" },
          storageUsed: { $sum: "$fileSize" }
        }
      }
    ]);

    const stats = aggregation[0] || { totalDownloads: 0, totalViews: 0, storageUsed: 0 };

    res.json({
      totalMaterials,
      thisWeek,
      totalDownloads: stats.totalDownloads,
      totalViews: stats.totalViews,
      storageUsed: stats.storageUsed
    });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Increment view count
router.post("/:id/view", authenticate, async (req: Request, res: Response) => {
  try {
    await Material.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.status(200).json({ message: "View count incremented" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Increment download count (POST) - Kept for tracking without redirection
router.post("/:id/download", authenticate, async (req: Request, res: Response) => {
  try {
    await Material.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } });
    res.status(200).json({ message: "Download count incremented" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// 📂 Serve Files (Stream from GridFS)
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
    else if (ext === ".mp4") contentType = "video/mp4";

    const downloadStream = bucket.openDownloadStreamByName(filename);

    // Set header so browser knows how to display it
    res.set("Content-Type", contentType);

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", (err) => {
      // console.error("Stream error:", err);
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

// 🗑️ Delete Material
router.delete("/:id", authenticate, async (req: AuthRequest, res: Response) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    // Optional: Check if user is the uploader or admin
    // if (material.uploadedBy !== req.user.name && req.user.role !== 'Admin') {
    //   return res.status(403).json({ message: "Unauthorized" });
    // }

    // Delete file from GridFS
    if (material.fileUrl && material.fileUrl.includes("/files/")) {
      const filename = path.basename(material.fileUrl);
      const bucket = getBucket();
      // We need file _id to delete from bucket, or we can use deleteByName if supported (it's not directly)
      // Standard GridFS delete requires _id. 
      // We can find the file by filename first.
      const files = await bucket.find({ filename }).toArray();
      if (files.length > 0) {
        await bucket.delete(files[0]._id);
      }
    }

    await material.deleteOne();
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Robust File Download (GET) - Serves the actual file
router.get("/:id/download", authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // 1. Atomically increment and get document
    const material = await Material.findByIdAndUpdate(
      id,
      { $inc: { downloads: 1 } },
      { new: true }
    );

    if (!material) {
      console.error(`Material not found: ${id}`);
      return res.status(404).json({ message: "Material record not found in database" });
    }

    const fileUrl = material.fileUrl;
    let filename = path.basename(fileUrl);

    // Attempt GridFS stream
    const bucket = getBucket();
    const downloadStream = bucket.openDownloadStreamByName(filename);

    // Sanitize download name
    let ext = path.extname(filename);
    if (!ext || ext === '.') {
      ext = `.${material.fileType}`;
    }
    const downloadName = `${material.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}${ext}`;

    res.set('Content-Disposition', `attachment; filename="${downloadName}"`);
    res.set('Access-Control-Expose-Headers', 'Content-Disposition');

    downloadStream.pipe(res)
      .on('error', (err) => {
        // Fallback to local file system for legacy files
        // If the fileUrl maps to a local path (starts with /uploads/materials/) relative to cwd
        const relativePath = material.fileUrl.startsWith('/') ? material.fileUrl.substring(1) : material.fileUrl;
        const filePath = path.resolve(process.cwd(), relativePath);

        console.error(`GridFS error for ${filename}, trying local: ${filePath}`);

        if (fs.existsSync(filePath)) {
          res.download(filePath, downloadName);
        } else {
          res.status(404).json({ message: "The requested file is missing from the server storage" });
        }
      });

  } catch (err: any) {
    console.error("Download route exception:", err);
    res.status(500).json({
      message: "Internal server error occurred while processing download",
      error: err.message
    });
  }
});

// Get recent materials (for "Recent Uploads" and Dashboard activity)
router.get("/recent", authenticate, async (req: Request, res: Response) => {
  try {
    // Limit to 5 or 10
    const materials = await Material.find().sort({ uploadedAt: -1 }).limit(10);
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get ALL materials (for Materials Library)
router.get("/", authenticate, async (req: Request, res: Response) => {
  try {
    const materials = await Material.find().sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get materials for course
router.get("/:courseCode", authenticate, async (req: Request, res: Response) => {
  try {
    const materials = await Material.find({ courseCode: req.params.courseCode }).sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
