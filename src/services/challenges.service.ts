import { Types } from 'mongoose';

import { DEFAULT_ACHIEVEMENT_DEFINITIONS } from '../constants/achievementDefinitions';
import { AchievementDefinition, type IAchievementDefinition } from '../models/AchievementDefinition';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { User } from '../models/User';
import { UserAchievement } from '../models/UserAchievement';

export type ChallengeStats = {
  completedLessons: number;
  totalLessons: number;
  completedCourses: number;
  startedTracks: number;
  xpTotal: number;
  streakCount: number;
};

export type CourseLeaderboardRow = {
  courseId: string;
  courseTitle: string;
  trackSlug: string;
  completedLessons: number;
  totalLessons: number;
  completionPct: number;
};

function roundPct(completed: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((completed / total) * 100);
}

function metricValue(metric: IAchievementDefinition['criteria']['metric'], stats: ChallengeStats): number {
  switch (metric) {
    case 'completed_lessons':
      return stats.completedLessons;
    case 'completed_courses':
      return stats.completedCourses;
    case 'started_tracks':
      return stats.startedTracks;
    case 'xp_total':
      return stats.xpTotal;
    case 'streak_count':
      return stats.streakCount;
    default:
      return 0;
  }
}

export async function ensureAchievementDefinitions(): Promise<void> {
  for (const def of DEFAULT_ACHIEVEMENT_DEFINITIONS) {
    await AchievementDefinition.findOneAndUpdate(
      { code: def.code },
      { $set: def },
      { upsert: true, new: true },
    );
  }
}

export async function getCourseLeaderboardForUser(userId: Types.ObjectId): Promise<CourseLeaderboardRow[]> {
  const [courses, totals, progress] = await Promise.all([
    Course.find({ isPublished: true }).sort({ sortOrder: 1, createdAt: 1 }).lean(),
    Lesson.aggregate<{ _id: Types.ObjectId; totalLessons: number }>([
      { $match: { isPublished: true } },
      { $group: { _id: '$courseId', totalLessons: { $sum: 1 } } },
    ]),
    LessonProgress.aggregate<{ _id: Types.ObjectId; completedLessons: number }>([
      { $match: { userId, completed: true } },
      { $group: { _id: '$courseId', completedLessons: { $sum: 1 } } },
    ]),
  ]);

  const totalMap = new Map(totals.map((t) => [t._id.toString(), t.totalLessons]));
  const doneMap = new Map(progress.map((p) => [p._id.toString(), p.completedLessons]));

  return courses
    .map((course) => {
      const cid = course._id.toString();
      const totalLessons = totalMap.get(cid) ?? 0;
      const completedLessons = doneMap.get(cid) ?? 0;
      return {
        courseId: cid,
        courseTitle: course.title,
        trackSlug: course.trackSlug,
        completedLessons,
        totalLessons,
        completionPct: roundPct(completedLessons, totalLessons),
      };
    })
    .filter((row) => row.totalLessons > 0)
    .sort((a, b) => b.completionPct - a.completionPct || b.completedLessons - a.completedLessons);
}

export async function getChallengeStats(userId: Types.ObjectId): Promise<ChallengeStats> {
  const [totalLessons, userProgress, user] = await Promise.all([
    Lesson.countDocuments({ isPublished: true }),
    LessonProgress.find({ userId, completed: true })
      .populate<{ lessonId: { trackSlug: string } }>('lessonId', 'trackSlug')
      .lean(),
    User.findById(userId).select('xpTotal streakCount').lean(),
  ]);

  const completedLessons = userProgress.length;
  const completedByCourse = new Map<string, number>();
  const startedTracks = new Set<string>();

  for (const row of userProgress) {
    const cid = row.courseId.toString();
    completedByCourse.set(cid, (completedByCourse.get(cid) ?? 0) + 1);
    const trackSlug = row.lessonId?.trackSlug;
    if (trackSlug) startedTracks.add(trackSlug);
  }

  const publishedLessonCounts = await Lesson.aggregate<{ _id: Types.ObjectId; total: number }>([
    { $match: { isPublished: true } },
    { $group: { _id: '$courseId', total: { $sum: 1 } } },
  ]);
  const lessonCountMap = new Map(publishedLessonCounts.map((x) => [x._id.toString(), x.total]));

  let completedCourses = 0;
  for (const [courseId, done] of completedByCourse.entries()) {
    const total = lessonCountMap.get(courseId) ?? 0;
    if (total > 0 && done >= total) completedCourses += 1;
  }

  return {
    completedLessons,
    totalLessons,
    completedCourses,
    startedTracks: startedTracks.size,
    xpTotal: Math.max(0, user?.xpTotal ?? 0),
    streakCount: Math.max(0, user?.streakCount ?? 0),
  };
}

export async function recomputeUserChallengeState(userId: Types.ObjectId) {
  await ensureAchievementDefinitions();
  const [stats, definitions] = await Promise.all([
    getChallengeStats(userId),
    AchievementDefinition.find({ active: true }).sort({ sortOrder: 1 }).lean(),
  ]);

  for (const def of definitions) {
    const value = Math.max(0, metricValue(def.criteria.metric, stats));
    const threshold = Math.max(1, def.criteria.threshold);
    const unlocked = value >= threshold;

    const existing = await UserAchievement.findOne({ userId, code: def.code }).lean();
    const unlockedAt = unlocked ? existing?.unlockedAt ?? new Date() : undefined;

    await UserAchievement.findOneAndUpdate(
      { userId, code: def.code },
      {
        $set: {
          progressValue: value,
          threshold,
          unlocked,
          unlockedAt,
        },
      },
      { upsert: true, new: true },
    );
  }

  const badges = await UserAchievement.find({ userId }).sort({ updatedAt: -1 }).lean();
  const leaderboard = await getCourseLeaderboardForUser(userId);

  return { stats, badges, leaderboard };
}
