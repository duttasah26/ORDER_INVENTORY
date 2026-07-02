import './Loader.css';

/**
 * Small inline spinner used inside buttons mid-mutation, or as a standalone
 * loading indicator. CSS-only rotating border-radius circle.
 */
export function Loader({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'loader--sm' : 'loader--md';

  return (
    <span className={`loader ${sizeClass}`} role="status" aria-label="Loading">
      <span className="loader__spinner" aria-hidden="true" />
    </span>
  );
}

export default Loader;
