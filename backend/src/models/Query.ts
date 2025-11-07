import mongoose, { Schema } from 'mongoose';

const QuerySchema = new Schema({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  faculty: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, required: true },
  question: { type: String, required: true },
  urgent: { type: Boolean, default: false },
  status: { type: String, enum: ['pending','answered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Query', QuerySchema);
