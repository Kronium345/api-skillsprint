import mongoose, { type Document, Schema, Types } from 'mongoose';

export type VideoSource = 'curated' | 'ai_suggested' | 'search_approved' | 'none';

export type VideoCandidate = {
  videoId: string;
  title: string;
  channelTitle: string;
  thumbnail: string;
  url: string;
};

export interface ILesson extends Document {
  courseId: Types.ObjectId;
  trackSlug: string;
  title: string;
  summary: string;
  content: string;
  videoUrl?: string;
  videoSearchQuery?: string;
  videoSource: VideoSource;
  videoCandidates: VideoCandidate[];
  keyTerms: string[];
  order: number;
  durationMinutes: number;
  isPublished: boolean;
}

const videoCandidateSchema = new Schema<VideoCandidate>(
  {
    videoId: { type: String, required: true },
    title: { type: String, required: true },
    channelTitle: { type: String, required: true },
    thumbnail: { type: String, default: '' },
    url: { type: String, required: true },
  },
  { _id: false },
);

const lessonSchema = new Schema<ILesson>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    trackSlug: { type: String, required: true, index: true },
    title: { type: String, required: true },
    summary: { type: String, default: '' },
    content: { type: String, default: '' },
    videoUrl: { type: String },
    videoSearchQuery: { type: String },
    videoSource: { type: String, default: 'none' },
    videoCandidates: { type: [videoCandidateSchema], default: [] },
    keyTerms: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    durationMinutes: { type: Number, default: 10 },
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
