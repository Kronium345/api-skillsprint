import mongoose, { type Document, Schema } from 'mongoose';

export interface IAiGeneratedContent extends Document {
  type: 'lesson' | 'course' | 'quiz' | 'flashcards' | 'tutor';
  promptTopic: string;
  trackSlug?: string;
  rawResponse: string;
  parsedSuccess: boolean;
}

const aiSchema = new Schema<IAiGeneratedContent>(
  {
    type: { type: String, required: true },
    promptTopic: { type: String, required: true },
    trackSlug: { type: String },
    rawResponse: { type: String, default: '' },
    parsedSuccess: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const AiGeneratedContent = mongoose.model<IAiGeneratedContent>(
  'AiGeneratedContent',
  aiSchema,
);
