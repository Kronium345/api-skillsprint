import mongoose, { type Document, Schema, Types } from 'mongoose';

export interface ILessonProgress extends Document {
  userId: Types.ObjectId;
  lessonId: Types.ObjectId;
  courseId: Types.ObjectId;
  completed: boolean;
  score?: number;
  xpEarned: number;
  completedAt?: Date;
}

const lessonProgressSchema = new Schema<ILessonProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number },
    xpEarned: { type: Number, default: 0 },
    completedAt: { type: Date },
  },
  { timestamps: true },
);

lessonProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });

export const LessonProgress = mongoose.model<ILessonProgress>(
  'LessonProgress',
  lessonProgressSchema,
);
