/**
 * SkeletonLoader.jsx — Reusable skeleton loading component.
 */
import PropTypes from 'prop-types';

export default function SkeletonLoader({ variant = 'text', count = 1, width, height }) {
  const items = Array.from({ length: count }, (_, i) => i);

  const getClassName = () => {
    switch (variant) {
      case 'card': return 'skeleton skeleton--card';
      case 'circle': return 'skeleton skeleton--circle';
      case 'title': return 'skeleton skeleton--title';
      case 'video': return 'skeleton skeleton--video';
      default: return 'skeleton skeleton--text';
    }
  };

  return (
    <div className="skeleton-wrapper" aria-busy="true" aria-label="Loading content">
      {items.map((i) => (
        <div
          key={i}
          className={getClassName()}
          style={{
            width: width || undefined,
            height: height || undefined,
          }}
        />
      ))}
    </div>
  );
}

SkeletonLoader.propTypes = {
  variant: PropTypes.oneOf(['text', 'card', 'circle', 'title', 'video']),
  count: PropTypes.number,
  width: PropTypes.string,
  height: PropTypes.string,
};
