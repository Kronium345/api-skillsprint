import mongoose, { type Document, Schema, Types } from 'mongoose';

export type ILessonQuizOption = {
  text: string;
  isCorrect: boolean;
};

export interface ILessonQuiz extends Document {
  lessonId: Types.ObjectId;
  question: string;
  explanation?: string;
  options: ILessonQuizOption[];
  order: number;
}

const optionSchema = new Schema<ILessonQuizOption>(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
  },
  { _id: false },
);

const lessonQuizSchema = new Schema<ILessonQuiz>(
  {
    lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true, index: true },
    question: { type: String, required: true },
    explanation: { type: String },
    options: { type: [optionSchema], required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const LessonQuiz = mongoose.model<ILessonQuiz>('LessonQuiz', lessonQuizSchema);
