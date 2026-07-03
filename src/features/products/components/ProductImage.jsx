import { useState } from 'react';
import { Package } from 'lucide-react';
import { isValidCssColor } from '@shared/utils/helpers';
import './ProductImage.css';

/**
 * Renders the product's photo from `image` (a URL, e.g. product.image from
 * db.json) when present. Falls back to a generated colour swatch from
 * `colour` when `image` is missing or fails to load, and further falls back
 * to a diagonal-stripe placeholder with a centered Package icon when
 * `colour` isn't a valid CSS colour either (e.g. seed data typos like
 * "VOILET").
 *
 * @param {object} props
 * @param {string} [props.image] - product photo URL
 * @param {string} [props.colour]
 * @param {string} [props.alt]
 * @param {'card'|'avatar'} [props.variant]
 */
export function ProductImage({ image, colour, alt, variant = 'card' }) {
  const [imageFailed, setImageFailed] = useState(false);

  if (image && !imageFailed) {
    return (
      <img
        src={image}
        alt={alt || 'Product'}
        className={`product-image product-image--${variant}`}
        onError={() => setImageFailed(true)}
      />
    );
  }

  const isValid = isValidCssColor(colour);

  return (
    <div
      className={`product-image product-image--${variant} ${
        isValid ? '' : 'product-image--placeholder'
      }`}
      style={isValid ? { backgroundColor: colour } : undefined}
      role="img"
      aria-label={isValid ? `${colour} colour swatch` : 'No colour available'}
    >
      {!isValid ? (
        <Package
          className="product-image__icon"
          size={variant === 'card' ? 28 : 14}
          strokeWidth={1.75}
          aria-hidden="true"
        />
      ) : null}
    </div>
  );
}

export default ProductImage;
