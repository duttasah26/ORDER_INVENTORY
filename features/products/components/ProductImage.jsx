import { Package } from 'lucide-react';
import { isValidCssColor } from '@shared/utils/helpers';
import './ProductImage.css';

/**
 * Products have no photo — the "image" is a generated colour swatch from the
 * product's `colour` field. Falls back to a diagonal-stripe placeholder with
 * a centered Package icon when `colour` isn't a valid CSS colour (e.g. seed
 * data typos like "VOILET").
 *
 * @param {object} props
 * @param {string} props.colour
 * @param {'card'|'avatar'} [props.variant]
 */
export function ProductImage({ colour, variant = 'card' }) {
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
