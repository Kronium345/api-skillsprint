import mongoose, { type Document, Schema } from 'mongoose';

export interface ITrack extends Document {
  slug: string;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  moduleOrder: string[];
  sortOrder: number;
  isActive: boolean;
}

const trackSchema = new Schema<ITrack>(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    icon: { type: String, default: 'book' },
    color: { type: String, default: '#4F8CFF' },
    moduleOrder: { type: [String], default: [] },
    sortOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Track = mongoose.model<ITrack>('Track', trackSchema);
