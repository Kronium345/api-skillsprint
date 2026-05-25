import { Router } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { FlaggedQuestion } from '../models/FlaggedQuestion';
import { ok, serverError } from '../utils/apiResponse';

const router = Router();

router.post('/flag', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { questionText, chapterId, trackSlug } = req.body;
    const flagged = await FlaggedQuestion.create({
      userId: req.user!._id,
      questionText,
      chapterId,
      trackSlug,
    });
    return ok(res, { id: flagged._id.toString() });
  } catch (error) {
    return serverError(res, error);
  }
});

router.get('/flagged', requireAuth, async (req: AuthRequest, res) => {
  try {
    const items = await FlaggedQuestion.find({ userId: req.user!._id }).sort({ createdAt: -1 });
    return ok(res, items);
  } catch (error) {
    return serverError(res, error);
  }
});

export default router;
