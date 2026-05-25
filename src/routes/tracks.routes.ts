import { Router } from 'express';

import { TRACKS, getTrackBySlug } from '../constants/tracks';
import { Chapter } from '../models/Chapter';
import { FlashCard } from '../models/FlashCard';
import { Track } from '../models/Track';
import { fail, ok, serverError } from '../utils/apiResponse';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const dbTracks = await Track.find({ isActive: true }).sort({ sortOrder: 1 }).lean();
    return ok(res, dbTracks.length ? dbTracks : TRACKS);
  } catch (error) {
    return serverError(res, error);
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const track =
      (await Track.findOne({ slug: req.params.slug }).lean()) ??
      getTrackBySlug(req.params.slug);
    if (!track) return fail(res, 'Track not found', 404);
    return ok(res, track);
  } catch (error) {
    return serverError(res, error);
  }
});

router.get('/:slug/modules', async (req, res) => {
  try {
    const { slug } = req.params;
    const track = getTrackBySlug(slug);
    if (!track) return fail(res, 'Track not found', 404);

    const chapters = await Chapter.find({ trackSlug: slug, isPublished: true })
      .sort({ createdAt: 1 })
      .lean();

    const ordered = track.moduleOrder
      .map((key) => chapters.filter((c) => c.moduleKey === key))
      .flat();

    const extras = chapters.filter((c) => !track.moduleOrder.includes(c.moduleKey));
    return ok(res, [...ordered, ...extras]);
  } catch (error) {
    return serverError(res, error);
  }
});

router.get('/:slug/flashcard-decks', async (req, res) => {
  try {
    const decks = await FlashCard.find({
      trackSlug: req.params.slug,
      isPublished: true,
    }).lean();
    return ok(res, decks);
  } catch (error) {
    return serverError(res, error);
  }
});

export default router;
