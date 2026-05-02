/**
 * SkeletonLoader.tsx — Reusable skeleton loading component.
 */

/** Supported skeleton variants. */
type SkeletonVariant = 'text' | 'card' | 'circle' | 'title' | 'video';

/** Props for SkeletonLoader. */
interface SkeletonLoaderProps {
  /** The visual style of the skeleton */
  readonly variant?: SkeletonVariant;
  /** The number of skeletons to render */
  readonly count?: number;
  /** Optional custom width */
  readonly width?: string;
  /** Optional custom height */
  readonly height?: string;
}

/**
 * SkeletonLoader component for displaying loading placeholders.
 */
export default function SkeletonLoader({
  variant = 'text',
  count = 1,
  width,
  height,
}: SkeletonLoaderProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  const getClassName = (): string => {
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
