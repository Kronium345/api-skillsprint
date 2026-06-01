/**
 * Generate starter courses via Gemini and persist to MongoDB.
 *
 * Usage:
 *   npm run seed:gemini
 *   npm run seed:gemini -- --force          (regenerate even if track has courses)
 *   npm run seed:gemini -- --only=data-analytics
 *
 * Note: Free-tier Gemini quotas are easy to hit. Use longer delays or billing if you see 429.
 */
import 'dotenv/config';

import { TRACKS, getTrackBySlug, type TrackSlug } from '../src/constants/tracks';
import { connectDb } from '../src/config/db';
import { Course } from '../src/models/Course';
import { Lesson } from '../src/models/Lesson';
import { Track } from '../src/models/Track';
import { buildGenerateCoursePrompt } from '../src/prompts/generateCourse.prompt';
import {
  persistLessonContent,
  updateCourseDuration,
} from '../src/services/contentPersistence.service';
import { generateWithGemini, isGeminiConfigured } from '../src/services/gemini.service';
import type { GeneratedCoursePayload } from '../src/types/content';
import { safeJsonParse } from '../src/utils/safeJsonParse';

const LESSON_COUNT = 3;
const DELAY_BETWEEN_TRACKS_MS = 45_000;

type TrackSeedPlan = {
  slug: TrackSlug;
  topic: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
};

const TRACK_PLANS: TrackSeedPlan[] = [
  {
    slug: 'generative-ai',
    topic: 'Advanced Prompt Patterns and Chain-of-Thought',
    skillLevel: 'intermediate',
  },
  {
    slug: 'data-analytics',
    topic: 'Excel Fundamentals for Data Analysis',
    skillLevel: 'beginner',
  },
  {
    slug: 'cybersecurity',
    topic: 'Cybersecurity Essentials: Phishing, Passwords, and Privacy',
    skillLevel: 'beginner',
  },
  {
    slug: 'software-development',
    topic: 'HTML and CSS Web Development Basics',
    skillLevel: 'beginner',
  },
  {
    slug: 'digital-marketing',
    topic: 'SEO and Content Marketing Fundamentals',
    skillLevel: 'beginner',
  },
  {
    slug: 'career-development',
    topic: 'CV, LinkedIn, and Interview Preparation Essentials',
    skillLevel: 'beginner',
  },
  {
    slug: 'productivity',
    topic: 'Notion, Task Systems, and AI Productivity Workflows',
    skillLevel: 'beginner',
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseRetryDelayMs(message: string): number | null {
  const match = message.match(/retry in ([\d.]+)s/i);
  if (!match) return null;
  return Math.ceil(parseFloat(match[1]) * 1000) + 2000;
}

function isRateLimitError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err);
  return msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED');
}

async function generateCoursePayload(
  plan: TrackSeedPlan,
  category: string,
): Promise<GeneratedCoursePayload> {
  const prompt = buildGenerateCoursePrompt({
    category,
    topic: plan.topic,
    skillLevel: plan.skillLevel,
    lessonCount: LESSON_COUNT,
  });

  let lastError: unknown;
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const raw = await generateWithGemini(prompt);
      return safeJsonParse<GeneratedCoursePayload>(raw);
    } catch (err) {
      lastError = err;
      const delay = isRateLimitError(err)
        ? (parseRetryDelayMs(err instanceof Error ? err.message : String(err)) ?? 60_000)
        : 3000;
      console.warn(`  attempt ${attempt} failed for ${plan.slug}, waiting ${delay}ms`);
      if (attempt < 4) await sleep(delay);
    }
  }
  throw lastError;
}

async function seedTrack(plan: TrackSeedPlan, force: boolean): Promise<boolean> {
  const track = getTrackBySlug(plan.slug);
  if (!track) {
    console.warn(`Unknown track slug: ${plan.slug}`);
    return false;
  }

  const existing = await Course.countDocuments({ trackSlug: plan.slug, isPublished: true });
  if (existing > 0 && !force) {
    console.log(`Skip ${plan.slug} — already has ${existing} course(s)`);
    return true;
  }

  console.log(`\nGenerating: [${plan.slug}] ${plan.topic}...`);
  const parsed = await generateCoursePayload(plan, track.title);

  const course = await Course.findOneAndUpdate(
    { trackSlug: plan.slug, title: parsed.title },
    {
      $set: {
        trackSlug: plan.slug,
        title: parsed.title,
        description: parsed.description,
        difficulty: parsed.difficulty ?? plan.skillLevel,
        isPublished: true,
        sortOrder: existing + 1,
      },
    },
    { upsert: true, new: true },
  );

  await Lesson.deleteMany({ courseId: course._id });

  const moduleKeys = track.moduleOrder;
  for (let i = 0; i < parsed.lessons.length; i++) {
    const payload = parsed.lessons[i];
    const moduleKey = moduleKeys[i] ?? moduleKeys[moduleKeys.length - 1] ?? `lesson-${i + 1}`;
    await persistLessonContent({ course, payload, order: i, moduleKey });
    console.log(`  lesson ${i + 1}: ${payload.title} (${moduleKey})`);
  }

  await updateCourseDuration(course._id);
  console.log(`Done: ${course.title}`);
  return true;
}

function plansToRun(): TrackSeedPlan[] {
  const onlyArg = process.argv.find((a) => a.startsWith('--only='));
  if (!onlyArg) return TRACK_PLANS;
  const slug = onlyArg.split('=')[1] as TrackSlug;
  return TRACK_PLANS.filter((p) => p.slug === slug);
}

async function main() {
  const force = process.argv.includes('--force');

  if (!isGeminiConfigured()) {
    console.error('GEMINI_API_KEY is not set in .env');
    process.exit(1);
  }

  const uri =
    process.env.MONGO_URI ??
    process.env.MONGODB_URI ??
    'mongodb://127.0.0.1:27017/skillsprint';
  await connectDb(uri);

  for (const track of TRACKS) {
    await Track.findOneAndUpdate(
      { slug: track.slug },
      { $set: { ...track, isActive: true } },
      { upsert: true },
    );
  }
  console.log(`Tracks synced (${TRACKS.length})`);
  console.log(`Model: ${process.env.GEMINI_MODEL ?? 'gemini-2.0-flash'}`);

  const plans = plansToRun();
  const failures: string[] = [];

  for (const plan of plans) {
    try {
      await seedTrack(plan, force);
    } catch (err) {
      console.error(`FAILED ${plan.slug}:`, err instanceof Error ? err.message : err);
      failures.push(plan.slug);
    }
    await sleep(DELAY_BETWEEN_TRACKS_MS);
  }

  console.log('\n=== Gemini seed summary ===');
  for (const track of TRACKS) {
    const count = await Course.countDocuments({ trackSlug: track.slug, isPublished: true });
    console.log(`  ${track.slug}: ${count} course(s)`);
  }

  if (failures.length) {
    console.error(`\nFailed tracks: ${failures.join(', ')}`);
    console.error('Retry later: npm run seed:gemini -- --only=<slug>');
    process.exit(1);
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
