import { Router } from 'express';

import { aiStatus, askTutor, generateCourse, generateLesson } from '../controllers/ai.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/status', aiStatus);
router.post('/generate-lesson', requireAuth, generateLesson);
router.post('/generate-course', requireAuth, generateCourse);
router.post('/tutor', requireAuth, askTutor);

export default router;
