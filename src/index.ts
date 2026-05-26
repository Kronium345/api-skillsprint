import 'dotenv/config';

import express from 'express';
import morgan from 'morgan';

import { corsMiddleware } from './config/cors';
import { connectDb } from './config/db';
import { BRAND } from './constants/brand';
import { requireAuth } from './middleware/auth';
import authRoutes from './routes/auth.routes';
import chapterRoutes from './routes/chapter.routes';
import cquizRoutes, { createQuiz } from './routes/cquiz.routes';
import eventRoutes from './routes/event.routes';
import flaggedRoutes from './routes/flagged.routes';
import flashRoutes, { fquizRouter } from './routes/flash.routes';
import homepageRoutes from './routes/homepage.routes';
import aiRoutes from './routes/ai.routes';
import coursesRoutes from './routes/courses.routes';
import progressRoutes from './routes/progress.routes';
import tracksRoutes from './routes/tracks.routes';
import videoRoutes from './routes/video.routes';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(corsMiddleware);
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_req, res) => {
  res.json({
    app: BRAND.appName,
    academy: BRAND.academyName,
    version: BRAND.apiVersion,
  });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const api = express.Router();

api.use('/auth', authRoutes);
api.use('/ai', aiRoutes);
api.use('/courses', coursesRoutes);
api.use('/video', videoRoutes);
api.use('/tracks', tracksRoutes);
api.use('/progress', progressRoutes);
api.use('/chapter', chapterRoutes);
api.use('/cquiz', cquizRoutes);
api.post('/quiz/create', requireAuth, createQuiz);
api.use('/fquiz', fquizRouter);
api.use('/flash', flashRoutes);
api.use('/flagged', flaggedRoutes);
api.use('/event', eventRoutes);
api.use(homepageRoutes);

app.use('/', api);

async function start() {
  const uri = process.env.MONGO_URI ?? process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGO_URI or MONGODB_URI is required');
    process.exit(1);
  }
  if (!process.env.KEY) {
    console.warn('Warning: KEY is not set — auth will fail');
  }

  await connectDb(uri);
  app.listen(PORT, () => {
    console.log(`${BRAND.appName} API running on http://localhost:${PORT}`);
    console.log(`Mobile base URL: http://localhost:${PORT}/api`);
  });
}

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
