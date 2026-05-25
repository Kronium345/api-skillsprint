import { Router } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { Event } from '../models/Event';
import { ok, serverError } from '../utils/apiResponse';

const router = Router();

router.post('/create-event', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { title, goalType, trackSlug, targetDate } = req.body;
    const event = await Event.create({
      userId: req.user!._id,
      title,
      goalType: goalType ?? 'career',
      trackSlug,
      targetDate,
    });
    return ok(res, event);
  } catch (error) {
    return serverError(res, error);
  }
});

export default router;
