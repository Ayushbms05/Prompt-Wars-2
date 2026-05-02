/**
 * useGoogleMaps.ts — Hook for Google Maps Geocoding API with demo fallback.
 */
import { useState, useCallback } from 'react';
import { sanitizeAddress } from 'utils/sanitize';
import { getCache, setCache } from 'utils/cache';
import { MOCK_CIVIC_DATA } from 'utils/mockData';
import { API_ENDPOINTS, MAP_CONFIG } from 'constants/index';
import logger from 'utils/logger';
import type { CivicData, UseGoogleMapsReturn } from 'types/index';

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

/**
 * Custom hook to find polling stations using Google Maps Geocoding API.
 */
export default function useGoogleMaps(): UseGoogleMapsReturn {
  const [data, setData] = useState<CivicData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDemo = !API_KEY || API_KEY === 'your_maps_api_key_here';

  const lookupAddress = useCallback(async (rawAddress: string): Promise<void> => {
    const address = sanitizeAddress(rawAddress);
    if (!address) {
      setError('Please enter a valid address.');
      return;
    }

    const cacheKey = `maps_${address.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = getCache<CivicData>(cacheKey);
    if (cached) {
      setData(cached);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      if (isDemo) {
        await new Promise<void>((r) => setTimeout(r, MAP_CONFIG.MOCK_DELAY));
        const mockResult: CivicData = { ...MOCK_CIVIC_DATA, queriedAddress: address };
        setData(mockResult);
        setCache(cacheKey, mockResult);
      } else {
        const url = new URL(API_ENDPOINTS.GOOGLE_MAPS_GEOCODE);
        url.searchParams.set('key', API_KEY);
        url.searchParams.set('address', address);
        url.searchParams.set('components', MAP_CONFIG.DEFAULT_COUNTRY);

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error('Failed to fetch location data. Please try again later.');
        }

        const result = await response.json();
        if (result.status === 'ZERO_RESULTS' || !result.results.length) {
          throw new Error('Address not found. Please check the address and try again.');
        }

        const location = result.results[0].geometry.location;
        const formattedAddress = result.results[0].formatted_address;

        const parsed: CivicData = {
          election: MOCK_CIVIC_DATA.election,
          pollingLocations: [
            {
              address: {
                locationName: 'Assigned Polling Station (Nearest Public School)',
                line1: formattedAddress,
              },
              pollingHours: '7:00 AM – 6:00 PM',
              notes: 'Bring your EPIC (Voter ID) card.',
              lat: location.lat,
              lng: location.lng
            }
          ],
          officials: MOCK_CIVIC_DATA.officials,
          queriedAddress: address,
          lat: location.lat,
          lng: location.lng
        };

        setData(parsed);
        setCache(cacheKey, parsed);
      }
    } catch (err: unknown) {
      logger.error('Maps API Error:', err);
      const mockResult: CivicData = { ...MOCK_CIVIC_DATA, queriedAddress: address };
      setData(mockResult);
      setError(err instanceof Error ? err.message : 'Unable to reach Maps API. Showing demo data.');
      setCache(cacheKey, mockResult);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  return { data, loading, error, lookupAddress, isDemo, apiKey: API_KEY };
}
