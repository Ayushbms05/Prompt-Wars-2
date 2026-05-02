/**
 * useYouTube.ts — Hook for YouTube Data API v3 with demo fallback.
 */
import { useState, useCallback, useEffect } from 'react';
import { getCache, setCache } from 'utils/cache';
import { MOCK_VIDEOS } from 'utils/mockData';
import { API_ENDPOINTS, YOUTUBE_CONFIG } from 'constants/index';
import logger from 'utils/logger';
import type { VideoResult, UseYouTubeReturn } from 'types/index';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Custom hook to fetch election education videos from YouTube.
 */
export default function useYouTube(): UseYouTubeReturn {
  const [videos, setVideos] = useState<VideoResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isDemo = !API_KEY || API_KEY === 'your_youtube_data_api_key_here';

  const searchVideos = useCallback(async (): Promise<void> => {
    const cached = getCache<VideoResult[]>(YOUTUBE_CONFIG.CACHE_KEY);
    if (cached) {
      setVideos(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemo) {
        await new Promise<void>((r) => setTimeout(r, YOUTUBE_CONFIG.MOCK_DELAY));
        setVideos([...MOCK_VIDEOS]);
        setCache(YOUTUBE_CONFIG.CACHE_KEY, [...MOCK_VIDEOS]);
      } else {
        const searchParams = new URLSearchParams({
          key: API_KEY,
          q: YOUTUBE_CONFIG.DEFAULT_QUERY,
          part: 'snippet',
          type: 'video',
          maxResults: YOUTUBE_CONFIG.MAX_RESULTS,
          videoEmbeddable: 'true',
          safeSearch: 'strict',
          relevanceLanguage: 'en',
          order: 'relevance',
        });

        const searchRes = await fetch(`${API_ENDPOINTS.YOUTUBE_SEARCH}?${searchParams}`);
        if (!searchRes.ok) throw new Error('YouTube search failed');
        const searchData = await searchRes.json();

        const videoIds = searchData.items.map((item: { id: { videoId: string } }) => item.id.videoId).join(',');

        const statsParams = new URLSearchParams({
          key: API_KEY,
          id: videoIds,
          part: 'statistics,snippet',
        });

        const statsRes = await fetch(`${API_ENDPOINTS.YOUTUBE_VIDEOS}?${statsParams}`);
        if (!statsRes.ok) throw new Error('Failed to fetch video details');
        const statsData = await statsRes.json();

        const parsed: VideoResult[] = statsData.items.map((item: any) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium?.url ?? item.snippet.thumbnails.default?.url,
          viewCount: Number(item.statistics.viewCount).toLocaleString(),
          publishedAt: item.snippet.publishedAt?.slice(0, 10),
        }));

        setVideos(parsed);
        setCache(YOUTUBE_CONFIG.CACHE_KEY, parsed);
      }
    } catch (err: unknown) {
      logger.error('YouTube API Error:', err);
      setVideos([...MOCK_VIDEOS]);
      setError('YouTube API unavailable. Showing demo videos.');
      setCache(YOUTUBE_CONFIG.CACHE_KEY, [...MOCK_VIDEOS]);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    searchVideos();
  }, [searchVideos]);

  return { videos, loading, error, refresh: searchVideos, isDemo };
}
