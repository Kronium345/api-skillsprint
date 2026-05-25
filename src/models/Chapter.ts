import mongoose, { type Document, Schema } from 'mongoose';

export type MCQ = {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
};

export interface IChapter extends Document {
  title: string;
  description?: string;
  trackSlug: string;
  moduleKey: string;
  tags: string[];
  difficulty?: string;
  questions: MCQ[];
  questionCount: number;
  isPublished: boolean;
}

const mcqSchema = new Schema<MCQ>(
  {
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: Number, required: true },
    explanation: { type: String },
  },
  { _id: false },
);

const chapterSchema = new Schema<IChapter>(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    trackSlug: { type: String, required: true, index: true },
    moduleKey: { type: String, required: true },
    tags: { type: [String], default: [] },
    difficulty: { type: String, default: 'beginner' },
    questions: { type: [mcqSchema], default: [] },
    questionCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

chapterSchema.pre('save', function (next) {
  this.questionCount = this.questions?.length ?? 0;
  next();
});

export const Chapter = mongoose.model<IChapter>('Chapter', chapterSchema);
