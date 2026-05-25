import { Router } from 'express';

import {
  completeLesson,
  getCourse,
  getLesson,
  listCourses,
  listLessons,
} from '../controllers/courses.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/', listCourses);
router.get('/lessons/:lessonId', getLesson);
router.post('/lessons/:lessonId/complete', requireAuth, completeLesson);
router.get('/:courseId/lessons', listLessons);
router.get('/:courseId', getCourse);

export default router;
