/**
 * useYouTube.js — Hook for YouTube Data API v3 with demo fallback.
 */
import { useState, useCallback, useEffect } from 'react';
import { getCache, setCache } from '../utils/cache';
import { MOCK_VIDEOS } from '../utils/mockData';
import { API_ENDPOINTS, YOUTUBE_CONFIG } from '../constants';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

/**
 * Custom hook to fetch election education videos from YouTube.
 * @returns {{
 *   videos: Array<{id: string, title: string, channelTitle: string, thumbnail: string, viewCount: string, publishedAt: string}>,
 *   loading: boolean,
 *   error: string | null,
 *   refresh: () => Promise<void>,
 *   isDemo: boolean
 * }}
 */
export default function useYouTube() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDemo = !API_KEY || API_KEY === 'your_youtube_data_api_key_here';

  /**
   * Searches for videos using the YouTube Data API or falls back to mock data.
   */
  const searchVideos = useCallback(async () => {
    // Check cache first
    const cached = getCache(YOUTUBE_CONFIG.CACHE_KEY);
    if (cached) {
      setVideos(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemo) {
        await new Promise((r) => setTimeout(r, YOUTUBE_CONFIG.MOCK_DELAY));
        setVideos(MOCK_VIDEOS);
        setCache(YOUTUBE_CONFIG.CACHE_KEY, MOCK_VIDEOS);
      } else {
        // Step 1: Search for election education videos
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

        const videoIds = searchData.items.map((item) => item.id.videoId).join(',');

        // Step 2: Get video statistics
        const statsParams = new URLSearchParams({
          key: API_KEY,
          id: videoIds,
          part: 'statistics,snippet',
        });

        const statsRes = await fetch(`${API_ENDPOINTS.YOUTUBE_VIDEOS}?${statsParams}`);
        if (!statsRes.ok) throw new Error('Failed to fetch video details');
        const statsData = await statsRes.json();

        const parsed = statsData.items.map((item) => ({
          id: item.id,
          title: item.snippet.title,
          channelTitle: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
          viewCount: Number(item.statistics.viewCount).toLocaleString(),
          publishedAt: item.snippet.publishedAt?.slice(0, 10),
        }));

        setVideos(parsed);
        setCache(YOUTUBE_CONFIG.CACHE_KEY, parsed);
      }
    } catch (err) {
      console.error('YouTube API Error:', err);
      // Fallback to mock data
      setVideos(MOCK_VIDEOS);
      setError('YouTube API unavailable. Showing demo videos.');
      setCache(YOUTUBE_CONFIG.CACHE_KEY, MOCK_VIDEOS);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    searchVideos();
  }, [searchVideos]);

  return { videos, loading, error, refresh: searchVideos, isDemo };
}
