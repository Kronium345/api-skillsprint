import { Router } from 'express';

import { getTrackBySlug } from '../constants/tracks';
import { Chapter } from '../models/Chapter';
import { fail, ok, serverError } from '../utils/apiResponse';

const router = Router();

/** Mobile: GET /chapter?track=slug or ?trackSlug=slug */
router.get('/', async (req, res) => {
  try {
    const trackSlug =
      (req.query.trackSlug as string) ||
      (req.query.track as string) ||
      undefined;

    const filter: Record<string, unknown> = { isPublished: true };
    if (trackSlug) {
      const track = getTrackBySlug(trackSlug);
      if (!track) return fail(res, 'Track not found', 404);
      filter.trackSlug = trackSlug;
    }

    const chapters = await Chapter.find(filter).sort({ createdAt: 1 }).lean();

    const payload = chapters.map((ch) => ({
      id: ch._id.toString(),
      title: ch.title,
      description: ch.description,
      trackSlug: ch.trackSlug,
      moduleKey: ch.moduleKey,
      questionCount: ch.questionCount,
      difficulty: ch.difficulty,
      tags: ch.tags,
    }));

    return ok(res, payload);
  } catch (error) {
    return serverError(res, error);
  }
});

export default router;
