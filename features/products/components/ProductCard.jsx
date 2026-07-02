import { useNavigate } from 'react-router-dom';
import { Star, Pencil, Trash2 } from 'lucide-react';
import formatCurrency from '@shared/utils/formatCurrency';
import { useCartStore } from '@features/cart/store/cartStore';
import { ProductImage } from './ProductImage';
import './ProductCard.css';

function StarRating({ rating }) {
  const numericRating = Number(rating) || 0;
  const fullStars = Math.floor(numericRating);
  const hasHalfStar = numericRating - fullStars >= 0.5;

  return (
    <div className="product-card__rating" aria-label={`Rated ${numericRating} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const starNumber = index + 1;
        if (starNumber <= fullStars) {
          return (
            <Star
              key={index}
              size={14}
              strokeWidth={2}
              className="product-card__star product-card__star--filled"
            />
          );
        }
        if (starNumber === fullStars + 1 && hasHalfStar) {
          return (
            <span key={index} className="product-card__star-half-wrapper">
              <Star size={14} strokeWidth={2} className="product-card__star" />
              <span className="product-card__star-half-overlay">
                <Star size={14} strokeWidth={2} className="product-card__star product-card__star--filled" />
              </span>
            </span>
          );
        }
        return <Star key={index} size={14} strokeWidth={2} className="product-card__star" />;
      })}
    </div>
  );
}

/**
 * @param {object} props
 * @param {object} props.product - `{id, product_name, unit_price, colour, brand, size, rating}`
 * @param {'customer'|'admin'} [props.mode]
 * @param {() => void} [props.onAddToCart]
 * @param {() => void} [props.onEdit]
 * @param {() => void} [props.onDelete]
 */
export function ProductCard({ product, mode = 'customer', onAddToCart, onEdit, onDelete }) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  function goToDetails() {
    navigate(`/products/${product.id}`);
  }

  function handleAddToCart(event) {
    event.stopPropagation();
    if (onAddToCart) {
      onAddToCart();
      return;
    }
    addItem(
      {
        productId: product.id,
        productName: product.product_name,
        unitPrice: product.unit_price,
        colour: product.colour,
      },
      1
    );
  }

  function handleEdit(event) {
    event.stopPropagation();
    onEdit?.();
  }

  function handleDelete(event) {
    event.stopPropagation();
    onDelete?.();
  }

  return (
    <div className={`product-card product-card--${mode}`}>
      {mode === 'admin' ? (
        <div className="product-card__admin-actions">
          <button
            type="button"
            className="btn btn-outline-secondary product-card__admin-action"
            onClick={handleEdit}
            aria-label={`Edit ${product.product_name}`}
            title="Edit"
          >
            <Pencil size={14} strokeWidth={2} />
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary product-card__admin-action product-card__admin-action--danger"
            onClick={handleDelete}
            aria-label={`Delete ${product.product_name}`}
            title="Delete"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
      ) : null}

      {/*
        The "go to details" click/keyboard region is a separate element from
        the "Add to Cart" button below it (a sibling, not an ancestor) so a
        real <button> is never nested inside an element with role="button" -
        nesting interactive elements is invalid semantics and breaks
        accessible-name based targeting (screen readers, Testing
        Library/Playwright `getByRole` all resolve to the outer element).
      */}
      <div
        className="product-card__clickable"
        onClick={mode === 'customer' ? goToDetails : undefined}
        role={mode === 'customer' ? 'button' : undefined}
        tabIndex={mode === 'customer' ? 0 : undefined}
        onKeyDown={
          mode === 'customer'
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  goToDetails();
                }
              }
            : undefined
        }
      >
        <ProductImage colour={product.colour} variant="card" />

        <div className="product-card__body">
          <p className="product-card__name">{product.product_name}</p>
          <span className="product-card__brand-badge">{product.brand}</span>

          {mode === 'customer' ? (
            <>
              <p className="product-card__price tabular-nums">{formatCurrency(product.unit_price)}</p>
              <StarRating rating={product.rating} />
            </>
          ) : null}
        </div>
      </div>

      {mode === 'customer' ? (
        <button type="button" className="btn btn-primary product-card__add-btn" onClick={handleAddToCart}>
          Add to Cart
        </button>
      ) : null}
    </div>
  );
}

export default ProductCard;
