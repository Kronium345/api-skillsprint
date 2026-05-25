import mongoose, { type Document, Schema } from 'mongoose';

export type FlashcardItem = {
  front: string;
  back: string;
};

export interface IFlashCard extends Document {
  title: string;
  trackSlug: string;
  moduleKey: string;
  cards: FlashcardItem[];
  cardCount: number;
  isPublished: boolean;
}

const cardSchema = new Schema<FlashcardItem>(
  {
    front: { type: String, required: true },
    back: { type: String, required: true },
  },
  { _id: false },
);

const flashCardSchema = new Schema<IFlashCard>(
  {
    title: { type: String, required: true },
    trackSlug: { type: String, required: true, index: true },
    moduleKey: { type: String, default: 'basics' },
    cards: { type: [cardSchema], default: [] },
    cardCount: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

flashCardSchema.pre('save', function (next) {
  this.cardCount = this.cards?.length ?? 0;
  next();
});

export const FlashCard = mongoose.model<IFlashCard>('FlashCard', flashCardSchema);
