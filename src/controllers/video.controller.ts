import type { Response } from 'express';

import type { AuthRequest } from '../middleware/auth';
import { Lesson } from '../models/Lesson';
import { fail, ok, serverError } from '../utils/apiResponse';
import {
  buildSearchQuery,
  isYoutubeConfigured,
  searchVideos,
} from '../services/youtube.service';

/**
 * POST /api/video/suggest/:lessonId
 *
 * Searches YouTube (allowlisted channels only) and stores candidates on the lesson.
 * Does NOT auto-assign videoUrl — returns candidates for you to approve.
 */
export async function suggestVideos(req: AuthRequest, res: Response) {
  try {
    if (!isYoutubeConfigured()) {
      return fail(res, 'YOUTUBE_API_KEY is not set', 503);
    }

    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return fail(res, 'Lesson not found', 404);

    const { query: overrideQuery, maxResults } = req.body as {
      query?: string;
      maxResults?: number;
    };

    const query = overrideQuery ?? buildSearchQuery({
      videoSearchQuery: lesson.videoSearchQuery,
      title: lesson.title,
      keyTerms: lesson.keyTerms,
      trackSlug: lesson.trackSlug,
      skillLevel: 'beginner',
    });

    const candidates = await searchVideos({
      query,
      trackSlug: lesson.trackSlug,
      maxResults: maxResults ?? 3,
    });

    lesson.videoCandidates = candidates;
    lesson.videoSearchQuery = query;
    await lesson.save();

    return ok(res, {
      lessonId: lesson._id.toString(),
      query,
      candidates,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * POST /api/video/approve/:lessonId
 *
 * Pick one candidate (by videoId) and set it as the lesson's videoUrl.
 * Or pass a custom `videoUrl` to approve a manually-curated link.
 */
export async function approveVideo(req: AuthRequest, res: Response) {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) return fail(res, 'Lesson not found', 404);

    const { videoId, videoUrl } = req.body as {
      videoId?: string;
      videoUrl?: string;
    };

    if (videoUrl) {
      lesson.videoUrl = videoUrl;
      lesson.videoSource = 'curated';
      await lesson.save();
      return ok(res, { videoUrl: lesson.videoUrl, videoSource: lesson.videoSource });
    }

    if (!videoId) {
      return fail(res, 'Provide videoId (from candidates) or a custom videoUrl');
    }

    const match = lesson.videoCandidates.find((c) => c.videoId === videoId);
    if (!match) {
      return fail(res, 'videoId not found in candidates — run suggest first');
    }

    lesson.videoUrl = match.url;
    lesson.videoSource = 'search_approved';
    await lesson.save();

    return ok(res, {
      videoUrl: lesson.videoUrl,
      videoSource: lesson.videoSource,
      approved: match,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

/**
 * POST /api/video/bulk-suggest
 *
 * Suggest videos for all lessons in a course that don't have a videoUrl yet.
 */
export async function bulkSuggestVideos(req: AuthRequest, res: Response) {
  try {
    if (!isYoutubeConfigured()) {
      return fail(res, 'YOUTUBE_API_KEY is not set', 503);
    }

    const { courseId } = req.body as { courseId: string };
    if (!courseId) return fail(res, 'courseId is required');

    const lessons = await Lesson.find({ courseId, isPublished: true }).sort({ order: 1 });
    const needsVideo = lessons.filter((l) => !l.videoUrl);

    const results: { lessonId: string; title: string; candidateCount: number }[] = [];

    for (const lesson of needsVideo) {
      const query = buildSearchQuery({
        videoSearchQuery: lesson.videoSearchQuery,
        title: lesson.title,
        keyTerms: lesson.keyTerms,
        trackSlug: lesson.trackSlug,
      });

      const candidates = await searchVideos({
        query,
        trackSlug: lesson.trackSlug,
        maxResults: 3,
      });

      lesson.videoCandidates = candidates;
      lesson.videoSearchQuery = query;
      await lesson.save();

      results.push({
        lessonId: lesson._id.toString(),
        title: lesson.title,
        candidateCount: candidates.length,
      });
    }

    return ok(res, {
      total: lessons.length,
      withVideo: lessons.length - needsVideo.length,
      suggested: results,
    });
  } catch (error) {
    return serverError(res, error);
  }
}

/** GET /api/video/status */
export async function videoStatus(_req: AuthRequest, res: Response) {
  return ok(res, { youtubeConfigured: isYoutubeConfigured() });
}
