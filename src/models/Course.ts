import mongoose, { type Document, Schema } from 'mongoose';

export interface ICourse extends Document {
  trackSlug: string;
  title: string;
  description: string;
  thumbnail?: string;
  difficulty: string;
  durationMinutes: number;
  isPremium: boolean;
  isPublished: boolean;
  sortOrder: number;
}

const courseSchema = new Schema<ICourse>(
  {
    trackSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    thumbnail: { type: String },
    difficulty: { type: String, default: 'beginner' },
    durationMinutes: { type: Number, default: 0 },
    isPremium: { type: Boolean, default: false },
    isPublished: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Course = mongoose.model<ICourse>('Course', courseSchema);
