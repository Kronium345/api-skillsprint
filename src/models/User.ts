import mongoose, { type Document, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  subscriptionPlan?: string;
  careerGoal?: string;
  experienceLevel?: string;
  targetRole?: string;
  xpTotal: number;
  streakCount: number;
  lastActiveAt?: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    subscriptionPlan: { type: String, default: 'free' },
    careerGoal: { type: String, default: '' },
    experienceLevel: { type: String, default: '' },
    targetRole: { type: String, default: '' },
    xpTotal: { type: Number, default: 0 },
    streakCount: { type: Number, default: 0 },
    lastActiveAt: { type: Date },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>('User', userSchema);
