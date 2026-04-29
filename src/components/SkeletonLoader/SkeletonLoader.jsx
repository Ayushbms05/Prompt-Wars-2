/**
 * SkeletonLoader.jsx — Reusable skeleton loading component.
 */
import PropTypes from 'prop-types';

/**
 * SkeletonLoader component for displaying loading placeholders.
 * @param {Object} props - Component props.
 * @param {'text' | 'card' | 'circle' | 'title' | 'video'} [props.variant='text'] - The visual style of the skeleton.
 * @param {number} [props.count=1] - The number of skeletons to render.
 * @param {string} [props.width] - Optional custom width.
 * @param {string} [props.height] - Optional custom height.
 * @returns {JSX.Element} The rendered SkeletonLoader component.
 */
export default function SkeletonLoader({ variant = 'text', count = 1, width, height }) {
  const items = Array.from({ length: count }, (_, i) => i);

  /**
   * Returns the appropriate class name based on the variant.
   * @returns {string} The CSS class name.
   */
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
  /** The visual style of the skeleton */
  variant: PropTypes.oneOf(['text', 'card', 'circle', 'title', 'video']),
  /** The number of skeletons to render */
  count: PropTypes.number,
  /** Optional custom width (e.g., '100%', '200px') */
  width: PropTypes.string,
  /** Optional custom height (e.g., '20px', '200px') */
  height: PropTypes.string,
};
