import mongoose, { type Document, Schema, Types } from 'mongoose';

import { type FlashcardItem } from './FlashCard';

const cardSchema = new Schema<FlashcardItem>(
  {
    front: { type: String, required: true },
    back: { type: String, required: true },
  },
  { _id: false },
);

export interface IFQuiz extends Document {
  userId: Types.ObjectId;
  flashCardId: Types.ObjectId;
  trackSlug: string;
  title: string;
  cards: FlashcardItem[];
  completed: boolean;
}

const fQuizSchema = new Schema<IFQuiz>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    flashCardId: { type: Schema.Types.ObjectId, ref: 'FlashCard', required: true },
    trackSlug: { type: String, required: true },
    title: { type: String, required: true },
    cards: { type: [cardSchema], default: [] },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const FQuiz = mongoose.model<IFQuiz>('FQuiz', fQuizSchema);
