import { Router } from 'express';

import {
  approveVideo,
  bulkSuggestVideos,
  suggestVideos,
  videoStatus,
} from '../controllers/video.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/status', videoStatus);
router.post('/suggest/:lessonId', requireAuth, suggestVideos);
router.post('/approve/:lessonId', requireAuth, approveVideo);
router.post('/bulk-suggest', requireAuth, bulkSuggestVideos);

export default router;
