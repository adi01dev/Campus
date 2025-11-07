import mongoose, { Schema } from 'mongoose';

export type Role = 'Student' | 'Faculty' | 'Admin';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['Student', 'Faculty', 'Admin'], required: true },
  googleId: { type: String },
  department: { type: String },
  semester: { type: String }, // ✅ added for Student details
  isMoUCoordinator: { type: Boolean, default: false },
  refreshToken: { type: String, default: null },
  resetPasswordToken: { type: String, default: null },
  resetPasswordExpiresAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', UserSchema);
