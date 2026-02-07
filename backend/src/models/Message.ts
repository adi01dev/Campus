import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sender: mongoose.Schema.Types.ObjectId; // Could be system or another user
    recipient: mongoose.Schema.Types.ObjectId;
    content: string;
    read: boolean;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model<IMessage>('Message', MessageSchema);
