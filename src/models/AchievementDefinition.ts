import mongoose, { type Document, Schema } from 'mongoose';

export type AchievementMetric =
  | 'completed_lessons'
  | 'completed_courses'
  | 'started_tracks'
  | 'xp_total'
  | 'streak_count';

export interface IAchievementDefinition extends Document {
  code: string;
  label: string;
  description: string;
  icon: string;
  category: 'learning' | 'streak' | 'xp' | 'completion';
  criteria: {
    metric: AchievementMetric;
    threshold: number;
  };
  reward?: {
    xpBonus?: number;
    badgeTier?: 'bronze' | 'silver' | 'gold';
  };
  active: boolean;
  sortOrder: number;
}

const achievementDefinitionSchema = new Schema<IAchievementDefinition>(
  {
    code: { type: String, required: true, unique: true, index: true, trim: true },
    label: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['learning', 'streak', 'xp', 'completion'],
      required: true,
    },
    criteria: {
      metric: {
        type: String,
        enum: ['completed_lessons', 'completed_courses', 'started_tracks', 'xp_total', 'streak_count'],
        required: true,
      },
      threshold: { type: Number, required: true, min: 1 },
    },
    reward: {
      xpBonus: { type: Number, min: 0 },
      badgeTier: { type: String, enum: ['bronze', 'silver', 'gold'] },
    },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const AchievementDefinition = mongoose.model<IAchievementDefinition>(
  'AchievementDefinition',
  achievementDefinitionSchema,
);
