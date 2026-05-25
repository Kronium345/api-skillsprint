import { Router } from 'express';

import { getDashboard } from '../controllers/progress.controller';
import { requireAuth } from '../middleware/auth';

/** Legacy mobile alias: GET /get-homepage */
const router = Router();

router.get('/get-homepage', requireAuth, getDashboard);

export default router;
