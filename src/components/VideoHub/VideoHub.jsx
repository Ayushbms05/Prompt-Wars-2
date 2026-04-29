/**
 * VideoHub.jsx — Lazy-loaded YouTube video grid powered by YouTube Data API v3.
 */
import { useState } from 'react';
import useYouTube from '../../hooks/useYouTube';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader';

/**
 * VideoHub component displaying a grid of election education videos.
 * @returns {JSX.Element} The rendered VideoHub component.
 */
export default function VideoHub() {
  const { videos, loading, error, isDemo } = useYouTube();
  const [activeVideo, setActiveVideo] = useState(null);

  return (
    <section className="video-hub" id="video-hub" aria-label="Election education videos">
      <div className="video-hub__header">
        <h2 className="video-hub__heading">Video Learning Hub</h2>
        <p className="video-hub__subtitle">
          Watch official election education videos to learn the voting process visually.
        </p>
        {isDemo && <span className="demo-badge">Demo Mode</span>}
      </div>

      {loading && (
        <div className="video-hub__grid">
          {[1, 2, 3].map((i) => (
            <div key={i} className="video-card video-card--skeleton">
              <SkeletonLoader variant="video" />
              <SkeletonLoader variant="title" />
              <SkeletonLoader variant="text" count={2} />
            </div>
          ))}
        </div>
      )}

      {error && <div className="video-hub__error" role="alert"><span aria-hidden="true">ℹ️</span> {error}</div>}

      {!loading && videos.length > 0 && (
        <div className="video-hub__grid">
          {videos.map((video, i) => (
            <div key={`${video.id}-${i}`} className="video-card"
              onClick={() => setActiveVideo(activeVideo === i ? null : i)}
              onKeyDown={(e) => e.key === 'Enter' && setActiveVideo(activeVideo === i ? null : i)}
              role="button" tabIndex={0}
              aria-label={`Play video: ${video.title}`}>
              {activeVideo === i ? (
                <div className="video-card__player">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.id}?autoplay=1&rel=0`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="video-card__iframe"
                  />
                </div>
              ) : (
                <div className="video-card__thumbnail">
                  <img src={video.thumbnail} alt={`Thumbnail for ${video.title}`} loading="lazy" />
                  <div className="video-card__play" aria-hidden="true">▶</div>
                </div>
              )}
              <div className="video-card__info">
                <h3 className="video-card__title">{video.title}</h3>
                <p className="video-card__channel">{video.channelTitle}</p>
                <div className="video-card__meta">
                  <span>{video.viewCount} views</span>
                  <span>{video.publishedAt}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && videos.length === 0 && !error && (
        <p className="video-hub__empty">No videos available at this time.</p>
      )}
    </section>
  );
}
