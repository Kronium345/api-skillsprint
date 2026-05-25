import type { Response } from 'express';
import { Router } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { Chapter } from '../models/Chapter';
import { CQuiz } from '../models/CQuiz';
import { fail, ok, serverError } from '../utils/apiResponse';

const router = Router();

export async function createQuiz(req: AuthRequest, res: Response) {
  try {
    const { chapterId, topicId, trackSlug } = req.body;
    const id = chapterId ?? topicId;
    if (!id) return fail(res, 'chapterId or topicId is required');

    const chapter = await Chapter.findById(id);
    if (!chapter) return fail(res, 'Chapter not found', 404);

    const quiz = await CQuiz.create({
      userId: req.user!._id,
      chapterId: chapter._id,
      trackSlug: trackSlug ?? chapter.trackSlug,
      title: chapter.title,
      questions: chapter.questions,
    });

    return ok(res, {
      id: quiz._id.toString(),
      title: quiz.title,
      questionCount: quiz.questions.length,
      trackSlug: quiz.trackSlug,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

router.post('/create', requireAuth, (req, res) => createQuiz(req, res));

router.get('/get/:id', requireAuth, async (req: AuthRequest, res) => {
  try {
    const quiz = await CQuiz.findOne({ _id: req.params.id, userId: req.user!._id });
    if (!quiz) return fail(res, 'Quiz session not found', 404);
    return ok(res, quiz);
  } catch (error) {
    return serverError(res, error);
  }
});

router.patch('/solve', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { quizId, answers } = req.body as { quizId: string; answers: number[] };
    const quiz = await CQuiz.findOne({ _id: quizId, userId: req.user!._id });
    if (!quiz) return fail(res, 'Quiz session not found', 404);

    let score = 0;
    answers.forEach((ans, i) => {
      if (quiz.questions[i] && quiz.questions[i].answer === ans) score += 1;
    });

    quiz.answers = answers;
    quiz.score = score;
    quiz.completed = true;
    await quiz.save();

    const user = req.user!;
    user.xpTotal += score * 10;
    user.streakCount = Math.max(1, user.streakCount);
    user.lastActiveAt = new Date();
    await user.save();

    return ok(res, {
      score,
      total: quiz.questions.length,
      xpEarned: score * 10,
      completed: true,
    });
  } catch (error) {
    return serverError(res, error);
  }
});

export default router;
