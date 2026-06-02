import mongoose, { type Document, Schema, Types } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: Types.ObjectId;
  code: string;
  unlocked: boolean;
  unlockedAt?: Date;
  progressValue: number;
  threshold: number;
  notified?: boolean;
}

const userAchievementSchema = new Schema<IUserAchievement>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    code: { type: String, required: true, index: true },
    unlocked: { type: Boolean, default: false },
    unlockedAt: { type: Date },
    progressValue: { type: Number, required: true, default: 0, min: 0 },
    threshold: { type: Number, required: true, min: 1 },
    notified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

userAchievementSchema.index({ userId: 1, code: 1 }, { unique: true });

export const UserAchievement = mongoose.model<IUserAchievement>('UserAchievement', userAchievementSchema);
