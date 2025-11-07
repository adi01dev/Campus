import express, { Request, Response } from "express";
import Material from "../models/Material";
import { createUploader } from "../middlewares/upload";
const router = express.Router();
const uploader = createUploader("materials");

router.post("/upload", uploader.single("file"), async (req: Request, res: Response) => {
  try {
    const { courseCode, title, description, uploadedBy } = req.body;
    if (!req.file) return res.status(400).json({ message: "File required" });

    const fileUrl = `/uploads/materials/${req.file.filename}`;
    const fileType = (req.file.mimetype || "").split("/")[1] || "file";

    const material = await Material.create({
      courseCode,
      title,
      description,
      fileUrl,
      fileType,
      uploadedBy,
    });

    res.status(201).json(material);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Get materials for course
router.get("/:courseCode", async (req: Request, res: Response) => {
  try {
    const materials = await Material.find({ courseCode: req.params.courseCode }).sort({ uploadedAt: -1 });
    res.json(materials);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;
