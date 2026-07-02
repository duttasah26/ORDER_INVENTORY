import './Skeleton.css';

/**
 * Generic loading placeholder. Uses the global `.skeleton-shimmer` class
 * (defined in @shared/styles/theme.css) for the shimmer animation.
 *
 * Also exports `SkeletonRow` and `SkeletonCard` convenience wrappers so
 * *Table / *Grid components can compose loading states without re-deriving
 * shapes/sizes themselves.
 */
export function Skeleton({ variant = 'text', width, height, count = 1 }) {
  const items = Array.from({ length: count }, (_, index) => index);

  return (
    <>
      {items.map((index) => (
        <span
          key={index}
          className={`skeleton skeleton--${variant} skeleton-shimmer`}
          style={{
            width: width ?? undefined,
            height: height ?? undefined,
          }}
          aria-hidden="true"
        />
      ))}
    </>
  );
}

/**
 * A single skeleton table row, matching a given column count. Intended for
 * use inside `<tbody>` while a DataTable is loading.
 */
export function SkeletonRow({ columns = 4, height = 16 }) {
  return (
    <tr className="skeleton-row">
      {Array.from({ length: columns }, (_, index) => (
        <td key={index}>
          <span
            className="skeleton skeleton--text skeleton-shimmer"
            style={{ height }}
            aria-hidden="true"
          />
        </td>
      ))}
    </tr>
  );
}

/**
 * A card-shaped skeleton: a rect "media/header" block plus a couple of
 * text lines. Intended for grid/card layouts while loading.
 */
export function SkeletonCard({ height = 120 }) {
  return (
    <div className="skeleton-card" aria-hidden="true">
      <span className="skeleton skeleton--rect skeleton-shimmer" style={{ height }} />
      <span className="skeleton skeleton--text skeleton-shimmer" style={{ width: '70%' }} />
      <span className="skeleton skeleton--text skeleton-shimmer" style={{ width: '40%' }} />
    </div>
  );
}

export default Skeleton;
