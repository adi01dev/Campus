import mongoose, { Document, Schema } from "mongoose";

export interface ISubmission {
  studentName: string;
  studentId: string;
  submissionText?: string;
  linkUrl?: string;
  fileUrl?: string;
  submittedAt: Date;
}

export interface IAssignment extends Document {
  title: string;
  subject: string;
  dueDate: string;
  totalMarks: number;
  instructions?: string;
  submissions: ISubmission[];
}

const submissionSchema = new Schema<ISubmission>({
  studentName: { type: String, required: true },
  studentId: { type: String, required: true },
  submissionText: String,
  linkUrl: String,
  fileUrl: String,
  submittedAt: { type: Date, default: Date.now },
});

const assignmentSchema = new Schema<IAssignment>(
  {
    title: { type: String, required: true },
    subject: { type: String, required: true },
    dueDate: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    instructions: String,
    submissions: [submissionSchema],
  },
  { timestamps: true }
);

const Assignment = mongoose.model<IAssignment>("Assignment", assignmentSchema);
export default Assignment;
