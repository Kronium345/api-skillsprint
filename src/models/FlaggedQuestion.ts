import mongoose, { type Document, Schema, Types } from 'mongoose';

export interface IFlaggedQuestion extends Document {
  userId: Types.ObjectId;
  chapterId?: Types.ObjectId;
  questionText: string;
  trackSlug?: string;
}

const flaggedSchema = new Schema<IFlaggedQuestion>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    chapterId: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    questionText: { type: String, required: true },
    trackSlug: { type: String },
  },
  { timestamps: true },
);

export const FlaggedQuestion = mongoose.model<IFlaggedQuestion>(
  'FlaggedQuestion',
  flaggedSchema,
);
