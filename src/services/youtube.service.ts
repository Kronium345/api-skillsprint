import { getChannelIdsForTrack } from '../constants/channels';
import type { VideoCandidate } from '../models/Lesson';

const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';

function getApiKey(): string | undefined {
  return process.env.YOUTUBE_API_KEY;
}

export function isYoutubeConfigured(): boolean {
  return Boolean(getApiKey());
}

type SearchParams = {
  query: string;
  trackSlug: string;
  maxResults?: number;
  durationFilter?: 'short' | 'medium' | 'long';
  language?: string;
};

type YouTubeSearchItem = {
  id: { videoId: string };
  snippet: {
    title: string;
    channelTitle: string;
    thumbnails: { medium?: { url: string } };
  };
};

/**
 * Search YouTube Data API v3 scoped to allowlisted channels for the track.
 *
 * Returns up to `maxResults` candidates (default 3).
 * Each channel is searched separately (YouTube search.list only accepts one channelId).
 */
export async function searchVideos(params: SearchParams): Promise<VideoCandidate[]> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('YOUTUBE_API_KEY is not set');

  const {
    query,
    trackSlug,
    maxResults = 3,
    durationFilter = 'medium',
    language = 'en',
  } = params;

  const channelIds = getChannelIdsForTrack(trackSlug);
  const candidates: VideoCandidate[] = [];

  const perChannel = Math.max(1, Math.ceil(maxResults / channelIds.length));

  for (const channelId of channelIds) {
    if (candidates.length >= maxResults) break;

    const url = new URL(`${YOUTUBE_API_BASE}/search`);
    url.searchParams.set('key', apiKey);
    url.searchParams.set('part', 'snippet');
    url.searchParams.set('type', 'video');
    url.searchParams.set('q', query);
    url.searchParams.set('channelId', channelId);
    url.searchParams.set('maxResults', String(perChannel));
    url.searchParams.set('relevanceLanguage', language);
    url.searchParams.set('safeSearch', 'strict');
    url.searchParams.set('videoDuration', durationFilter);
    url.searchParams.set('order', 'relevance');

    try {
      const res = await fetch(url.toString());
      if (!res.ok) continue;

      const json = (await res.json()) as { items?: YouTubeSearchItem[] };
      if (!json.items) continue;

      for (const item of json.items) {
        candidates.push({
          videoId: item.id.videoId,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails?.medium?.url ?? '',
          url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        });
      }
    } catch {
      // Skip channel on network / quota error
    }
  }

  return candidates.slice(0, maxResults);
}

/**
 * Build a sensible search query from lesson metadata.
 * If the lesson already has a `videoSearchQuery`, prefer that.
 */
export function buildSearchQuery(params: {
  videoSearchQuery?: string;
  title: string;
  keyTerms?: string[];
  trackSlug: string;
  skillLevel?: string;
}): string {
  if (params.videoSearchQuery) return params.videoSearchQuery;

  const parts = [
    params.title,
    ...(params.keyTerms ?? []).slice(0, 3),
    params.skillLevel ?? 'beginner',
    'tutorial',
  ];
  return parts.join(' ');
}
