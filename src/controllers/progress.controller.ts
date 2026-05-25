import type { Response } from 'express';

import { TRACKS } from '../constants/tracks';
import type { AuthRequest } from '../middleware/auth';
import { Chapter } from '../models/Chapter';
import { Course } from '../models/Course';
import { CQuiz } from '../models/CQuiz';
import { Lesson } from '../models/Lesson';
import { LessonProgress } from '../models/LessonProgress';
import { Track } from '../models/Track';
import { ok } from '../utils/apiResponse';
import { serializeUser } from '../utils/serializeUser';

export async function getDashboard(req: AuthRequest, res: Response) {
  const user = req.user!;
  const [completedQuizzes, completedLessons, coursesCount] = await Promise.all([
    CQuiz.countDocuments({ userId: user._id, completed: true }),
    LessonProgress.countDocuments({ userId: user._id, completed: true }),
    Course.countDocuments({ isPublished: true }),
  ]);
  const tracks = await Track.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
  const trackList = tracks.length > 0 ? tracks : TRACKS;

  const recentLessons = await Lesson.find({ isPublished: true })
    .sort({ updatedAt: -1 })
    .limit(5)
    .select('title trackSlug courseId durationMinutes')
    .lean();

  const progress = await LessonProgress.find({
    userId: user._id,
    lessonId: { $in: recentLessons.map((l) => l._id) },
  }).lean();
  const doneSet = new Set(progress.filter((p) => p.completed).map((p) => p.lessonId.toString()));

  return ok(res, {
    user: serializeUser(user),
    stats: {
      xpTotal: user.xpTotal,
      streakCount: user.streakCount,
      completedQuizzes,
      completedLessons,
      coursesAvailable: coursesCount,
      tracksAvailable: trackList.length,
    },
    featuredTracks: trackList.slice(0, 3),
    continueLearning: recentLessons.map((l) => ({
      id: l._id.toString(),
      courseId: l.courseId.toString(),
      title: l.title,
      trackSlug: l.trackSlug,
      durationMinutes: l.durationMinutes,
      completed: doneSet.has(l._id.toString()),
    })),
  });
}
