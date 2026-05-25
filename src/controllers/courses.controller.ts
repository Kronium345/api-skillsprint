import type { Response } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { Course } from '../models/Course';
import { Lesson } from '../models/Lesson';
import { LessonFlashcard } from '../models/LessonFlashcard';
import { LessonProgress } from '../models/LessonProgress';
import { LessonQuiz } from '../models/LessonQuiz';
import { fail, ok, serverError } from '../utils/apiResponse';

export async function listCourses(req: AuthRequest, res: Response) {
  try {
    const { trackSlug } = req.query;
    const filter: Record<string, unknown> = { isPublished: true };
    if (trackSlug) filter.trackSlug = trackSlug;

    const courses = await Course.find(filter).sort({ sortOrder: 1, createdAt: 1 }).lean();
    return ok(res, courses);
  } catch (error) {
    return serverError(res, error);
  }
}

export async function getCourse(req: AuthRequest, res: Response) {
  try {
    const course = await Course.findById(req.params.courseId).lean();
    if (!course) return fail(res, 'Course not found', 404);
    return ok(res, course);
  } catch (error) {
    return serverError(res, error);
  }
}

export async function listLessons(req: AuthRequest, res: Response) {
  try {
    const lessons = await Lesson.find({
      courseId: req.params.courseId,
      isPublished: true,
    })
      .sort({ order: 1 })
      .lean();

    const progress = req.user
      ? await LessonProgress.find({
          userId: req.user._id,
          courseId: req.params.courseId,
        }).lean()
      : [];

    const progressMap = new Map(progress.map((p) => [p.lessonId.toString(), p]));

    return ok(
      res,
      lessons.map((l) => ({
        id: l._id.toString(),
        courseId: l.courseId.toString(),
        trackSlug: l.trackSlug,
        title: l.title,
        summary: l.summary,
        videoUrl: l.videoUrl,
        order: l.order,
        durationMinutes: l.durationMinutes,
        completed: progressMap.get(l._id.toString())?.completed ?? false,
      })),
    );
  } catch (error) {
    return serverError(res, error);
  }
}

export async function getLesson(req: AuthRequest, res: Response) {
  try {
    const lesson = await Lesson.findById(req.params.lessonId).lean();
    if (!lesson) return fail(res, 'Lesson not found', 404);

    const [quiz, flashcards, userProgress] = await Promise.all([
      LessonQuiz.find({ lessonId: lesson._id }).sort({ order: 1 }).lean(),
      LessonFlashcard.find({ lessonId: lesson._id }).sort({ order: 1 }).lean(),
      req.user
        ? LessonProgress.findOne({ userId: req.user._id, lessonId: lesson._id }).lean()
        : null,
    ]);

    return ok(res, {
      id: lesson._id.toString(),
      courseId: lesson.courseId.toString(),
      trackSlug: lesson.trackSlug,
      title: lesson.title,
      summary: lesson.summary,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      keyTerms: lesson.keyTerms,
      durationMinutes: lesson.durationMinutes,
      quiz: quiz.map((q) => ({
        id: q._id.toString(),
        question: q.question,
        explanation: q.explanation,
        options: q.options.map((o) => ({ text: o.text, isCorrect: o.isCorrect })),
      })),
      flashcards: flashcards.map((c) => ({
        id: c._id.toString(),
        front: c.front,
        back: c.back,
      })),
      progress: userProgress
        ? {
            completed: userProgress.completed,
            score: userProgress.score,
            xpEarned: userProgress.xpEarned,
          }
        : null,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

export async function completeLesson(req: AuthRequest, res: Response) {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return fail(res, 'Lesson not found', 404);

    const { score = 0 } = req.body as { score?: number };
    const xpEarned = Math.max(10, Math.round(score * 5));

    const progress = await LessonProgress.findOneAndUpdate(
      { userId: req.user!._id, lessonId: lesson._id },
      {
        $set: {
          courseId: lesson.courseId,
          completed: true,
          score,
          xpEarned,
          completedAt: new Date(),
        },
      },
      { upsert: true, new: true },
    );

    req.user!.xpTotal += xpEarned;
    req.user!.streakCount = Math.max(1, (req.user!.streakCount ?? 0) + 1);
    req.user!.lastActiveAt = new Date();
    await req.user!.save();

    return ok(res, {
      progress,
      xpEarned,
      xpTotal: req.user!.xpTotal,
      streakCount: req.user!.streakCount,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
