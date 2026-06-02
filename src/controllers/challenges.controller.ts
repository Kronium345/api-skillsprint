import type { Response } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { AchievementDefinition } from '../models/AchievementDefinition';
import { UserAchievement } from '../models/UserAchievement';
import {
  ensureAchievementDefinitions,
  getCourseLeaderboardForUser,
  recomputeUserChallengeState,
} from '../services/challenges.service';
import { fail, ok, serverError } from '../utils/apiResponse';

export async function getChallengesSummary(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return fail(res, 'Unauthorized', 401);
    const { stats, badges, leaderboard } = await recomputeUserChallengeState(req.user._id);
    const definitions = await AchievementDefinition.find({ active: true })
      .select('code label description icon')
      .lean();
    const byCode = new Map(definitions.map((d) => [d.code, d]));
    return ok(res, {
      stats,
      badges: badges.map((b) => ({
        code: b.code,
        label: byCode.get(b.code)?.label ?? b.code,
        description: byCode.get(b.code)?.description ?? '',
        icon: byCode.get(b.code)?.icon ?? 'medal-outline',
        unlocked: b.unlocked,
        progressValue: b.progressValue,
        threshold: b.threshold,
        unlockedAt: b.unlockedAt ?? null,
      })),
      leaderboard,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

export async function getChallengesDefinitions(_req: AuthRequest, res: Response) {
  try {
    await ensureAchievementDefinitions();
    const definitions = await AchievementDefinition.find({ active: true })
      .sort({ sortOrder: 1 })
      .lean();
    return ok(res, definitions);
  } catch (error) {
    return serverError(res, error);
  }
}

export async function getChallengesUserBadges(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return fail(res, 'Unauthorized', 401);
    const { badges } = await recomputeUserChallengeState(req.user._id);
    const definitions = await AchievementDefinition.find({ active: true })
      .select('code label description icon')
      .lean();
    const byCode = new Map(definitions.map((d) => [d.code, d]));

    return ok(
      res,
      badges.map((b) => ({
        code: b.code,
        label: byCode.get(b.code)?.label ?? b.code,
        description: byCode.get(b.code)?.description ?? '',
        icon: byCode.get(b.code)?.icon ?? 'medal-outline',
        unlocked: b.unlocked,
        progressValue: b.progressValue,
        threshold: b.threshold,
        unlockedAt: b.unlockedAt ?? null,
      })),
    );
  } catch (error) {
    return serverError(res, error);
  }
}

export async function recomputeChallenges(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return fail(res, 'Unauthorized', 401);
    const { stats, badges, leaderboard } = await recomputeUserChallengeState(req.user._id);
    return ok(res, {
      recomputed: true,
      stats,
      badgeCount: badges.length,
      leaderboardCount: leaderboard.length,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

export async function getChallengesLeaderboard(req: AuthRequest, res: Response) {
  try {
    if (!req.user) return fail(res, 'Unauthorized', 401);
    const leaderboard = await getCourseLeaderboardForUser(req.user._id);
    return ok(res, leaderboard);
  } catch (error) {
    return serverError(res, error);
  }
}

export async function getChallengesBadges(req: AuthRequest, res: Response) {
  return getChallengesUserBadges(req, res);
}

export async function getChallengesOverview(req: AuthRequest, res: Response) {
  return getChallengesSummary(req, res);
}
