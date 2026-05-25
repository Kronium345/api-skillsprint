import { Router } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { requireAuth } from '../middleware/auth';
import { FlashCard } from '../models/FlashCard';
import { FQuiz } from '../models/FQuiz';
import { fail, ok, serverError } from '../utils/apiResponse';

const router = Router();

/** Legacy: GET /flash */
router.get('/', async (req, res) => {
  try {
    const trackSlug = (req.query.trackSlug as string) || (req.query.track as string);
    const filter: Record<string, unknown> = { isPublished: true };
    if (trackSlug) filter.trackSlug = trackSlug;

    const decks = await FlashCard.find(filter).lean();
    return ok(
      res,
      decks.map((d) => ({
        id: d._id.toString(),
        title: d.title,
        trackSlug: d.trackSlug,
        cardCount: d.cardCount,
      })),
    );
  } catch (error) {
    return serverError(res, error);
  }
});

const fquizRouter = Router();

fquizRouter.post('/create', requireAuth, async (req: AuthRequest, res) => {
  try {
    const { flashCardId, deckId, trackSlug } = req.body;
    const id = flashCardId ?? deckId;
    const deck = await FlashCard.findById(id);
    if (!deck) return fail(res, 'Flash deck not found', 404);

    const session = await FQuiz.create({
      userId: req.user!._id,
      flashCardId: deck._id,
      trackSlug: trackSlug ?? deck.trackSlug,
      title: deck.title,
      cards: deck.cards,
    });

    return ok(res, { id: session._id.toString(), title: session.title, cardCount: deck.cardCount });
  } catch (error) {
    return serverError(res, error);
  }
});

export { fquizRouter };
export default router;
