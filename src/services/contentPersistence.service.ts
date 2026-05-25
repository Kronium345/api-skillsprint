import type { GeneratedLessonPayload } from '../types/content';
import { Chapter, type MCQ } from '../models/Chapter';
import { Course, type ICourse } from '../models/Course';
import { FlashCard } from '../models/FlashCard';
import { Lesson, type ILesson } from '../models/Lesson';
import { LessonFlashcard } from '../models/LessonFlashcard';
import { LessonQuiz } from '../models/LessonQuiz';

function toMcqs(quiz: GeneratedLessonPayload['quiz']): MCQ[] {
  return quiz.map((q) => {
    const answerIndex = q.options.findIndex((o) => o.isCorrect);
    return {
      question: q.question,
      options: q.options.map((o) => o.text),
      answer: answerIndex >= 0 ? answerIndex : 0,
      explanation: q.explanation,
    };
  });
}

export async function persistLessonContent(params: {
  course: ICourse;
  payload: GeneratedLessonPayload;
  order: number;
  moduleKey: string;
}): Promise<ILesson> {
  const { course, payload, order, moduleKey } = params;

  const videoSource = payload.videoUrl ? 'curated' : 'none';

  const lesson = await Lesson.create({
    courseId: course._id,
    trackSlug: course.trackSlug,
    title: payload.title,
    summary: payload.summary,
    content: payload.content,
    videoUrl: payload.videoUrl,
    videoSearchQuery: payload.videoSearchQuery,
    videoSource,
    keyTerms: payload.keyTerms ?? [],
    order,
    durationMinutes: payload.durationMinutes ?? 10,
    isPublished: true,
  });

  if (payload.quiz?.length) {
    await LessonQuiz.insertMany(
      payload.quiz.map((q, i) => ({
        lessonId: lesson._id,
        question: q.question,
        explanation: q.explanation,
        options: q.options,
        order: i,
      })),
    );
  }

  if (payload.flashcards?.length) {
    await LessonFlashcard.insertMany(
      payload.flashcards.map((c, i) => ({
        lessonId: lesson._id,
        front: c.front,
        back: c.back,
        order: i,
      })),
    );

    await FlashCard.findOneAndUpdate(
      { trackSlug: course.trackSlug, title: `${payload.title} — Flashcards` },
      {
        $set: {
          trackSlug: course.trackSlug,
          moduleKey,
          title: `${payload.title} — Flashcards`,
          cards: payload.flashcards,
          cardCount: payload.flashcards.length,
          isPublished: true,
        },
      },
      { upsert: true },
    );
  }

  const mcqs = toMcqs(payload.quiz ?? []);
  await Chapter.findOneAndUpdate(
    { trackSlug: course.trackSlug, moduleKey, title: payload.title },
    {
      $set: {
        title: payload.title,
        description: payload.summary,
        trackSlug: course.trackSlug,
        moduleKey,
        tags: payload.keyTerms ?? [],
        difficulty: course.difficulty,
        questions: mcqs,
        questionCount: mcqs.length,
        isPublished: true,
      },
    },
    { upsert: true },
  );

  return lesson;
}

export async function updateCourseDuration(courseId: ICourse['_id']): Promise<void> {
  const lessons = await Lesson.find({ courseId }).select('durationMinutes');
  const total = lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0);
  await Course.findByIdAndUpdate(courseId, { durationMinutes: total });
}
