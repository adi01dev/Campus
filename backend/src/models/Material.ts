import mongoose, { Document, Schema } from "mongoose";

export interface IMaterial extends Document {
  courseCode: string;
  title: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: Date;
}

const MaterialSchema = new Schema<IMaterial>({
  courseCode: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  uploadedBy: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model<IMaterial>("Material", MaterialSchema);
