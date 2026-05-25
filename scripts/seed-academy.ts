import 'dotenv/config';

import { TRACKS } from '../src/constants/tracks';
import { connectDb } from '../src/config/db';
import { promptEngineeringCourse } from '../src/data/seeds/prompt-engineering-course';
import { generativeAiMcqs } from '../src/data/seeds/generative-ai-sample';
import { Chapter } from '../src/models/Chapter';
import { Course } from '../src/models/Course';
import { FlashCard } from '../src/models/FlashCard';
import { Lesson } from '../src/models/Lesson';
import { Track } from '../src/models/Track';
import {
  persistLessonContent,
  updateCourseDuration,
} from '../src/services/contentPersistence.service';

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

  const pe = promptEngineeringCourse;
  const course = await Course.findOneAndUpdate(
    { trackSlug: pe.trackSlug, title: pe.course.title },
    { $set: { ...pe.course, trackSlug: pe.trackSlug, isPublished: true } },
    { upsert: true, new: true },
  );
  console.log('Seeded course:', course.title);

  await Lesson.deleteMany({ courseId: course._id });
  for (const item of pe.lessons) {
    await persistLessonContent({
      course,
      payload: item.payload,
      order: item.order,
      moduleKey: item.moduleKey,
    });
    console.log('  lesson:', item.payload.title);
  }
  await updateCourseDuration(course._id);

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

  const deckCount = await FlashCard.countDocuments({ trackSlug: 'generative-ai' });
  console.log(`Flash decks for generative-ai: ${deckCount}`);
  console.log('Seed complete');
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
