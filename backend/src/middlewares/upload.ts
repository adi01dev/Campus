import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { MONGODB_URI } from "../config";

// Create storage engine
const storage = new GridFsStorage({
  url: MONGODB_URI,
  file: (_req, file) => {
    return new Promise((resolve, reject) => {
      const filename = `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads" // Collection name: uploads.files, uploads.chunks
      };
      resolve(fileInfo);
    });
  }
});

export const createUploader = (_subfolder: string) => {
  // subfolder arg is kept for compatibility but ignored in GridFS as we use buckets/metadata
  // You can use metadata to store subfolder info if needed
  return multer({ storage });
};
