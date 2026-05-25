import mongoose, { type Document, Schema, Types } from 'mongoose';

export interface IEvent extends Document {
  userId: Types.ObjectId;
  title: string;
  goalType: string;
  trackSlug?: string;
  targetDate?: Date;
  completed: boolean;
}

const eventSchema = new Schema<IEvent>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    goalType: { type: String, default: 'career' },
    trackSlug: { type: String },
    targetDate: { type: Date },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Event = mongoose.model<IEvent>('Event', eventSchema);
