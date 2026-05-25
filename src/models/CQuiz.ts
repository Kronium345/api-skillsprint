import mongoose, { type Document, Schema, Types } from 'mongoose';

import { type MCQ } from './Chapter';

const mcqSchema = new Schema<MCQ>(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: false },
);

export interface ICQuiz extends Document {
  userId: Types.ObjectId;
  chapterId: Types.ObjectId;
  trackSlug: string;
  title: string;
  questions: MCQ[];
  answers: number[];
  score: number;
  completed: boolean;
}

const cQuizSchema = new Schema<ICQuiz>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter', required: true },
    trackSlug: { type: String, required: true },
    title: { type: String, required: true },
    questions: { type: [mcqSchema], default: [] },
    answers: { type: [Number], default: [] },
    score: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const CQuiz = mongoose.model<ICQuiz>('CQuiz', cQuizSchema);
