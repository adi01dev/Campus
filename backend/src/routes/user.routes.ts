import express, { Request, Response } from "express";
import mongoose from "mongoose";
import path from "path";
import { authenticate, AuthRequest } from "../middlewares/auth";
import User from "../models/User";
import { createUploader } from "../middlewares/upload";

const router = express.Router();
const upload = createUploader("users");

// Helper to get GridFS Bucket
const getBucket = () => {
    return new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: "uploads"
    });
};

// POST /api/users/profile-image
router.post("/profile-image", authenticate, upload.single("file"), async (req: AuthRequest, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const userId = req.user.id;
        const filename = req.file.filename;
        const fileUrl = `/api/users/profile-image/${filename}`;

        // Update user profile
        const user = await User.findByIdAndUpdate(
            userId,
            { profileImage: fileUrl },
            { new: true }
        );

        res.json({ message: "Profile image updated", user });
    } catch (err: any) {
        console.error("Profile upload error:", err);
        res.status(500).json({ message: "Failed to upload profile image" });
    }
});

// GET /api/users/profile-image/:filename
router.get("/profile-image/:filename", async (req: Request, res: Response) => {
    try {
        const bucket = getBucket();
        const filename = req.params.filename;

        // Determine content type
        const ext = path.extname(filename).toLowerCase();
        let contentType = "image/jpeg";
        if (ext === ".png") contentType = "image/png";
        if (ext === ".gif") contentType = "image/gif";

        const downloadStream = bucket.openDownloadStreamByName(filename);

        res.set("Content-Type", contentType);

        downloadStream.on("data", (chunk) => {
            res.write(chunk);
        });

        downloadStream.on("error", () => {
            res.status(404).json({ message: "Image not found" });
        });

        downloadStream.on("end", () => {
            res.end();
        });
    } catch (err) {
        res.status(500).json({ message: "Error retrieving image" });
    }
});

export default router;
