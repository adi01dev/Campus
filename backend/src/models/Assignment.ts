import mongoose, { Schema } from 'mongoose';

const AssignmentSchema = new Schema({
  faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, required: true },
  title: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending','inprogress','completed'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Assignment', AssignmentSchema);
