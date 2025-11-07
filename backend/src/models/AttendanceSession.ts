import mongoose, { Schema } from 'mongoose';

const AttendanceSessionSchema = new Schema({
  faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, required: true },
  sessionDate: { type: Date, default: Date.now },
  qrCodeSessionId: { type: String, required: true },
  studentsMarked: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export default mongoose.model('AttendanceSession', AttendanceSessionSchema);
