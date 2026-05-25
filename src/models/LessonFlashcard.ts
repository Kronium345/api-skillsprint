import mongoose, { type Document, Schema, Types } from 'mongoose';

export interface ILessonFlashcard extends Document {
  lessonId: Types.ObjectId;
  front: string;
  back: string;
  order: number;
}

const lessonFlashcardSchema = new Schema<ILessonFlashcard>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const LessonFlashcard = mongoose.model<ILessonFlashcard>(
  'LessonFlashcard',
  lessonFlashcardSchema,
);
