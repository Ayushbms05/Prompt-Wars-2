/**
 * useYouTube.js — Hook for YouTube Data API v3 with demo fallback.
 */
import { useState, useCallback, useEffect } from 'react';
import { getCache, setCache } from '../utils/cache';
import { MOCK_VIDEOS } from '../utils/mockData';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const CACHE_KEY = 'yt_election_videos';

export default function useYouTube() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isDemo = !API_KEY || API_KEY === 'your_youtube_data_api_key_here';

  const searchVideos = useCallback(async () => {
    // Check cache first
    const cached = getCache(CACHE_KEY);
    if (cached) {
      setVideos(cached);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isDemo) {
        await new Promise((r) => setTimeout(r, 600));
        setVideos(MOCK_VIDEOS);
        setCache(CACHE_KEY, MOCK_VIDEOS);
      } else {
        // Step 1: Search for election education videos
        const searchParams = new URLSearchParams({
          key: API_KEY,
          q: '"how to vote in india" OR "voter registration india" official election commission',
          part: 'snippet',
          type: 'video',
          maxResults: '3',
          videoEmbeddable: 'true',
          safeSearch: 'strict',
          relevanceLanguage: 'en',
          order: 'relevance',
        });

        const searchRes = await fetch(`${SEARCH_URL}?${searchParams}`);
        if (!searchRes.ok) throw new Error('YouTube search failed');
        const searchData = await searchRes.json();

        const videoIds = searchData.items.map((item) => item.id.videoId).join(',');

        // Step 2: Get video statistics
        const statsParams = new URLSearchParams({
          key: API_KEY,
          id: videoIds,
          part: 'statistics,snippet',
        });

        const statsRes = await fetch(`${VIDEOS_URL}?${statsParams}`);
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
        setCache(CACHE_KEY, parsed);
      }
    } catch (err) {
      // Fallback to mock data
      setVideos(MOCK_VIDEOS);
      setError('YouTube API unavailable. Showing demo videos.');
      setCache(CACHE_KEY, MOCK_VIDEOS);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  useEffect(() => {
    searchVideos();
  }, [searchVideos]);

  return { videos, loading, error, refresh: searchVideos, isDemo };
}
