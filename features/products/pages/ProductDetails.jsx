import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Minus, Plus, PackageX, Star } from 'lucide-react';
import formatCurrency from '@shared/utils/formatCurrency';
import { EmptyState } from '@shared/components/common/EmptyState';
import { Loader } from '@shared/components/common/Loader';
import { useCartStore } from '@features/cart/store/cartStore';
import { useProducts } from '../hooks/useProducts';
import { ProductImage } from '../components/ProductImage';
import './ProductDetails.css';

const MAX_QUANTITY = 20;

/**
 * Route `/products/:id`. Reads from the shared `useProducts()` cache (no
 * dedicated by-id endpoint exists) rather than issuing its own fetch.
 */
export function ProductDetails() {
  const { id } = useParams();
  const { data: products, isLoading } = useProducts();
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  const product = (products ?? []).find((item) => String(item.id) === id);

  if (isLoading) {
    return (
      <div className="product-details product-details--loading">
        <Loader size="md" />
      </div>
    );
  }

  if (!product) {
    return (
      <EmptyState
        icon={PackageX}
        heading="Product not found"
        body="This product may have been removed or is no longer available."
        action={{ label: 'Back to Products', onClick: () => window.history.back() }}
      />
    );
  }

  function decrement() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increment() {
    setQuantity((current) => Math.min(MAX_QUANTITY, current + 1));
  }

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        productName: product.product_name,
        unitPrice: product.unit_price,
        colour: product.colour,
      },
      quantity
    );
  }

  const numericRating = Number(product.rating) || 0;

  return (
    <div className="product-details">
      <Link to="/" className="product-details__back-link">
        &larr; Back to Products
      </Link>

      <div className="product-details__layout">
        <div className="product-details__image">
          <ProductImage colour={product.colour} variant="card" />
        </div>

        <div className="product-details__info">
          <h1 className="product-details__name">{product.product_name}</h1>
          <span className="product-details__brand-badge">{product.brand}</span>

          <p className="product-details__price tabular-nums">{formatCurrency(product.unit_price)}</p>

          <div className="product-details__rating" aria-label={`Rated ${numericRating} out of 5`}>
            {Array.from({ length: 5 }, (_, index) => (
              <Star
                key={index}
                size={16}
                strokeWidth={2}
                className={`product-details__star ${
                  index < Math.round(numericRating) ? 'product-details__star--filled' : ''
                }`}
              />
            ))}
          </div>

          <dl className="product-details__meta">
            <div className="product-details__meta-row">
              <dt>Colour</dt>
              <dd>{product.colour}</dd>
            </div>
            <div className="product-details__meta-row">
              <dt>Size</dt>
              <dd>{product.size}</dd>
            </div>
          </dl>

          <div className="product-details__quantity-row">
            <span className="product-details__quantity-label">Quantity</span>
            <div className="product-details__stepper">
              <button
                type="button"
                className="product-details__stepper-btn"
                onClick={decrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                <Minus size={14} strokeWidth={2} />
              </button>
              <span className="product-details__stepper-value tabular-nums">{quantity}</span>
              <button
                type="button"
                className="product-details__stepper-btn"
                onClick={increment}
                disabled={quantity >= MAX_QUANTITY}
                aria-label="Increase quantity"
              >
                <Plus size={14} strokeWidth={2} />
              </button>
            </div>
          </div>

          <button type="button" className="btn btn-primary product-details__add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
