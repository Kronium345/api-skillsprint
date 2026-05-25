import { Router } from 'express';

import { getDashboard } from '../controllers/progress.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/dashboard', requireAuth, getDashboard);

export default router;
