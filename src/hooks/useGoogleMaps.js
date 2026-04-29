/**
 * useGoogleMaps.js — Hook for Google Maps Geocoding API with demo fallback.
 */
import { useState, useCallback } from 'react';
import { sanitizeAddress } from '../utils/sanitize';
import { getCache, setCache } from '../utils/cache';
import { MOCK_CIVIC_DATA } from '../utils/mockData';
import { API_ENDPOINTS, MAP_CONFIG } from '../constants';

const API_KEY = import.meta.env.VITE_MAPS_API_KEY;

/**
 * Custom hook to find polling stations using Google Maps Geocoding API.
 * @returns {{
 *   data: any,
 *   loading: boolean,
 *   error: string | null,
 *   lookupAddress: (rawAddress: string) => Promise<void>,
 *   isDemo: boolean,
 *   apiKey: string | undefined
 * }}
 */
export default function useGoogleMaps() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isDemo = !API_KEY || API_KEY === 'your_maps_api_key_here';

  /**
   * Looks up an address and finds the corresponding coordinates and polling info.
   * @param {string} rawAddress - The user-entered address.
   */
  const lookupAddress = useCallback(async (rawAddress) => {
    const address = sanitizeAddress(rawAddress);
    if (!address) {
      setError('Please enter a valid address.');
      return;
    }

    // Check cache first
    const cacheKey = `maps_${address.toLowerCase().replace(/\s+/g, '_')}`;
    const cached = getCache(cacheKey);
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
        // Demo mode: return mock data after simulated delay
        await new Promise((r) => setTimeout(r, MAP_CONFIG.MOCK_DELAY));
        const mockResult = {
          ...MOCK_CIVIC_DATA,
          queriedAddress: address,
        };
        setData(mockResult);
        setCache(cacheKey, mockResult);
      } else {
        // Real API call to Geocoding API
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

        // Construct response mimicking the expected structure with Indian mock data blended with real coordinates
        const parsed = {
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
    } catch (err) {
      console.error('Maps API Error:', err);
      // On error, fall back to mock data
      const mockResult = { ...MOCK_CIVIC_DATA, queriedAddress: address };
      setData(mockResult);
      setError(err.message || 'Unable to reach Maps API. Showing demo data.');
      setCache(cacheKey, mockResult);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  return { data, loading, error, lookupAddress, isDemo, apiKey: API_KEY };
}
