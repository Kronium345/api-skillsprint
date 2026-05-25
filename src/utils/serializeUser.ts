import type { IUser } from '../models/User';

export type SerializedUser = {
  id: string;
  email: string;
  username: string;
  careerGoal?: string;
  experienceLevel?: string;
  targetRole?: string;
  subscriptionPlan?: string;
  xp?: number;
  streak?: number;
  xpTotal?: number;
  streakCount?: number;
};

export function serializeUser(user: IUser): SerializedUser {
  return {
    id: user._id.toString(),
    email: user.email,
    username: user.username,
    careerGoal: user.careerGoal || undefined,
    experienceLevel: user.experienceLevel || undefined,
    targetRole: user.targetRole || undefined,
    subscriptionPlan: user.subscriptionPlan || undefined,
    xp: user.xpTotal ?? 0,
    streak: user.streakCount ?? 0,
    xpTotal: user.xpTotal ?? 0,
    streakCount: user.streakCount ?? 0,
  };
}
