import 'dotenv/config';

import { TRACKS } from '../src/constants/tracks';
import { connectDb } from '../src/config/db';
import { promptEngineeringCourse } from '../src/data/seeds/prompt-engineering-course';
import { STARTER_COURSES } from '../src/data/seeds/starter-courses';
import { generativeAiMcqs } from '../src/data/seeds/generative-ai-sample';
import { Chapter } from '../src/models/Chapter';
import { Course } from '../src/models/Course';
import { FlashCard } from '../src/models/FlashCard';
import { Lesson } from '../src/models/Lesson';
import { Track } from '../src/models/Track';
import type { SeedCourseDefinition } from '../src/data/seeds/starter-courses';
import {
  persistLessonContent,
  updateCourseDuration,
} from '../src/services/contentPersistence.service';

const ALL_COURSES: SeedCourseDefinition[] = [
  promptEngineeringCourse,
  ...STARTER_COURSES,
];

async function seedCourse(def: SeedCourseDefinition) {
  const course = await Course.findOneAndUpdate(
    { trackSlug: def.trackSlug, title: def.course.title },
    { $set: { ...def.course, trackSlug: def.trackSlug, isPublished: true } },
    { upsert: true, new: true },
  );
  console.log(`Seeded course [${def.trackSlug}]:`, course.title);

  await Lesson.deleteMany({ courseId: course._id });
  for (const item of def.lessons) {
    await persistLessonContent({
      course,
      payload: item.payload,
      order: item.order,
      moduleKey: item.moduleKey,
    });
    console.log('  lesson:', item.payload.title);
  }
  await updateCourseDuration(course._id);
}

async function seed() {
  const uri =
    process.env.MONGO_URI ??
    process.env.MONGODB_URI ??
    'mongodb://127.0.0.1:27017/skillsprint';
  await connectDb(uri);

  for (const track of TRACKS) {
    await Track.findOneAndUpdate(
      { slug: track.slug },
      { $set: { ...track, isActive: true } },
      { upsert: true, new: true },
    );
  }
  console.log(`Seeded ${TRACKS.length} tracks`);

  for (const def of ALL_COURSES) {
    await seedCourse(def);
  }

  await Chapter.findOneAndUpdate(
    { trackSlug: 'generative-ai', moduleKey: 'agents-apis', title: 'AI agents overview' },
    {
      $set: {
        title: 'AI agents overview',
        description: 'Coming soon — agents, tools, and APIs',
        trackSlug: 'generative-ai',
        moduleKey: 'agents-apis',
        tags: ['agents'],
        difficulty: 'advanced',
        questions: generativeAiMcqs.slice(0, 2),
        questionCount: 2,
        isPublished: true,
      },
    },
    { upsert: true },
  );

  console.log('\nCourses per track:');
  for (const track of TRACKS) {
    const count = await Course.countDocuments({ trackSlug: track.slug, isPublished: true });
    console.log(`  ${track.slug}: ${count}`);
  }

  const deckCount = await FlashCard.countDocuments();
  console.log(`\nTotal flash decks: ${deckCount}`);
  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
