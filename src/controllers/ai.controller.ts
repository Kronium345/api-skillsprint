import type { Response } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { AiGeneratedContent } from '../models/AiGeneratedContent';
import { Course } from '../models/Course';
import { buildGenerateCoursePrompt } from '../prompts/generateCourse.prompt';
import { buildGenerateLessonPrompt } from '../prompts/generateLesson.prompt';
import { buildTutorPrompt } from '../prompts/tutor.prompt';
import {
  persistLessonContent,
  updateCourseDuration,
} from '../services/contentPersistence.service';
import { generateWithGemini, isGeminiConfigured } from '../services/gemini.service';
import type { GeneratedCoursePayload, GeneratedLessonPayload } from '../types/content';
import { fail, ok, serverError } from '../utils/apiResponse';
import { safeJsonParse } from '../utils/safeJsonParse';

export async function generateLesson(req: AuthRequest, res: Response) {
  try {
    if (!isGeminiConfigured()) return fail(res, 'Gemini API key not configured', 503);

    const { category, topic, skillLevel, videoUrl, courseId, trackSlug, moduleKey, order } =
      req.body;

    if (!category || !topic || !skillLevel) {
      return fail(res, 'category, topic, and skillLevel are required');
    }

    const prompt = buildGenerateLessonPrompt({ category, topic, skillLevel, videoUrl });
    const raw = await generateWithGemini(prompt);

    let parsed: GeneratedLessonPayload;
    try {
      parsed = safeJsonParse<GeneratedLessonPayload>(raw);
    } catch (e) {
      await AiGeneratedContent.create({
        type: 'lesson',
        promptTopic: topic,
        trackSlug,
        rawResponse: raw,
        parsedSuccess: false,
      });
      return fail(res, e instanceof Error ? e.message : 'Invalid AI JSON', 502);
    }

    await AiGeneratedContent.create({
      type: 'lesson',
      promptTopic: topic,
      trackSlug,
      rawResponse: raw.slice(0, 5000),
      parsedSuccess: true,
    });

    let course = courseId ? await Course.findById(courseId) : null;
    if (!course && trackSlug) {
      course = await Course.findOne({ trackSlug, title: new RegExp(category, 'i') });
    }
    if (!course) {
      return ok(res, { preview: parsed, saved: false, message: 'Pass courseId to persist' });
    }

    const lesson = await persistLessonContent({
      course,
      payload: { ...parsed, videoUrl: parsed.videoUrl ?? videoUrl },
      order: order ?? 0,
      moduleKey: moduleKey ?? 'basics',
    });
    await updateCourseDuration(course._id);

    return ok(res, { lesson, preview: parsed, saved: true }, 201);
  } catch (error) {
    return serverError(res, error);
  }
}

export async function generateCourse(req: AuthRequest, res: Response) {
  try {
    if (!isGeminiConfigured()) return fail(res, 'Gemini API key not configured', 503);

    const { category, topic, skillLevel, trackSlug, lessonCount = 3 } = req.body;
    if (!category || !topic || !skillLevel || !trackSlug) {
      return fail(res, 'category, topic, skillLevel, and trackSlug are required');
    }

    const prompt = buildGenerateCoursePrompt({ category, topic, skillLevel, lessonCount });
    const raw = await generateWithGemini(prompt);
    const parsed = safeJsonParse<GeneratedCoursePayload>(raw);

    const course = await Course.create({
      trackSlug,
      title: parsed.title,
      description: parsed.description,
      difficulty: parsed.difficulty ?? skillLevel,
      isPublished: true,
      sortOrder: 0,
    });

    const lessons = [];
    for (let i = 0; i < parsed.lessons.length; i++) {
      const lesson = await persistLessonContent({
        course,
        payload: parsed.lessons[i],
        order: i,
        moduleKey: `lesson-${i + 1}`,
      });
      lessons.push(lesson);
    }
    await updateCourseDuration(course._id);

    return ok(res, { course, lessons, preview: parsed }, 201);
  } catch (error) {
    return serverError(res, error);
  }
}

export async function askTutor(req: AuthRequest, res: Response) {
  try {
    if (!isGeminiConfigured()) return fail(res, 'Gemini API key not configured', 503);

    const { message, lessonTitle, lessonContent } = req.body;
    if (!message) return fail(res, 'message is required');

    const prompt = buildTutorPrompt({ lessonTitle, lessonContent, userMessage: message });
    const reply = await generateWithGemini(prompt);

    return ok(res, { reply });
  } catch (error) {
    return serverError(res, error);
  }
}

export async function aiStatus(_req: AuthRequest, res: Response) {
  return ok(res, { geminiConfigured: isGeminiConfigured() });
}
