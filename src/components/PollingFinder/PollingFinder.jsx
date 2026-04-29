import { useState } from 'react';
import useGoogleMaps from '../../hooks/useGoogleMaps';
import { useTranslation } from '../../contexts/TranslationContext';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import { validateAddress } from '../../utils/validate';
import { VALIDATION_CONFIG } from '../../constants';

/**
 * PollingFinderContent component that handles address lookup.
 * @returns {JSX.Element} The rendered PollingFinderContent component.
 */
function PollingFinderContent() {
  const [address, setAddress] = useState('');
  const [localError, setLocalError] = useState(null);
  const { data, loading, error: apiError, lookupAddress, isDemo, apiKey } = useGoogleMaps();
  const { t } = useTranslation();

  const error = localError || apiError;

  /**
   * Handles form submission for address lookup.
   * @param {React.FormEvent} e - The form event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    const { isValid, error: validationError } = validateAddress(address);
    
    if (!isValid) {
      setLocalError(validationError);
      return;
    }

    setLocalError(null);
    lookupAddress(address);
  };

  /**
   * Renders the map iframe or a demo placeholder.
   * @param {number} lat - Latitude.
   * @param {number} lng - Longitude.
   * @returns {JSX.Element} The map element.
   */
  const renderMap = (lat, lng) => {
    if (isDemo || !apiKey || apiKey === 'your_maps_api_key_here') {
      return (
        <div className="polling-finder__map-placeholder">
          <p>🗺️ Interactive Map (Demo Mode)</p>
          <p className="polling-finder__coords">Lat: {lat}, Lng: {lng}</p>
        </div>
      );
    }
    
    const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
    
    return (
      <iframe
        width="100%"
        height="300"
        style={{ border: 0, borderRadius: '8px', marginTop: '1rem' }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        src={embedUrl}
        title="Map of Assigned Polling Station"
      ></iframe>
    );
  };

  return (
    <div className="polling-finder">
      <form onSubmit={handleSubmit} className="polling-finder__form">
        <div className="polling-finder__input-group">
          <label htmlFor="address-input" className="polling-finder__label">
            {t('Home Address')}
          </label>
          <input
            id="address-input"
            type="text"
            className="polling-finder__input"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (localError) setLocalError(null);
            }}
            placeholder="e.g., Sansad Marg, New Delhi, 110001"
            aria-required="true"
            minLength={VALIDATION_CONFIG.MIN_ADDRESS_LENGTH}
          />
        </div>
        <button
          type="submit"
          className="polling-finder__submit"
          aria-busy={loading}
          aria-label="Search for polling station"
        >
          🔍 {t('Find My Polling Station')}
        </button>
      </form>

      {error && (
        <div className="polling-finder__error" role="alert">
          {t(error)}
        </div>
      )}

      {loading && (
        <div className="polling-finder__loading">
          <SkeletonLoader count={3} />
        </div>
      )}

      {data && !loading && !error && (
        <div className="polling-finder__results" aria-live="polite">
          <div className="polling-finder__card">
            <h3 className="polling-finder__card-title">
              {t('Assigned Polling Station')}
            </h3>
            
            {data.pollingLocations?.length > 0 ? (
              <div className="polling-finder__location">
                <p className="polling-finder__location-name">
                  {data.pollingLocations[0].address.locationName}
                </p>
                <p className="polling-finder__location-address">
                  {data.pollingLocations[0].address.line1}
                </p>
                {data.pollingLocations[0].pollingHours && (
                  <p className="polling-finder__location-hours">
                    ⏱️ {t('Hours')}: {data.pollingLocations[0].pollingHours}
                  </p>
                )}
                {data.pollingLocations[0].notes && (
                  <p className="polling-finder__location-notes">
                    ℹ️ {t('Note')}: {data.pollingLocations[0].notes}
                  </p>
                )}
                
                {renderMap(data.lat, data.lng)}

                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${data.lat},${data.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="polling-finder__directions"
                >
                  🗺️ {t('Get Directions')}
                </a>
              </div>
            ) : (
              <p>{t('No polling location data found for this address.')}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * PollingFinder component wrapped in an ErrorBoundary.
 * @returns {JSX.Element} The rendered PollingFinder component.
 */
export default function PollingFinder() {
  return (
    <ErrorBoundary title="Polling Finder Error">
      <PollingFinderContent />
    </ErrorBoundary>
  );
}

PollingFinder.propTypes = {};
