import { SkeletonCard } from '@shared/components/common/Skeleton';
import { EmptyState } from '@shared/components/common/EmptyState';
import { ProductCard } from './ProductCard';
import './ProductGrid.css';

const SKELETON_COUNT = 8;

/**
 * Responsive card grid of products.
 *
 * @param {object} props
 * @param {Array<object>} props.products
 * @param {'customer'|'admin'} [props.mode]
 * @param {boolean} [props.isLoading]
 * @param {object|React.ReactNode} [props.emptyState] - `{icon, heading, body, action}` or a rendered node
 * @param {(product: object) => void} [props.onAddToCart]
 * @param {(product: object) => void} [props.onEdit]
 * @param {(product: object) => void} [props.onDelete]
 */
export function ProductGrid({ products, mode = 'customer', isLoading, emptyState, onAddToCart, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <SkeletonCard key={index} height={108} />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    if (emptyState && emptyState.$$typeof) {
      return emptyState;
    }
    return (
      <EmptyState
        icon={emptyState?.icon}
        heading={emptyState?.heading ?? 'No products found'}
        body={emptyState?.body ?? "There's nothing to show yet."}
        action={emptyState?.action}
      />
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          mode={mode}
          onAddToCart={onAddToCart ? () => onAddToCart(product) : undefined}
          onEdit={onEdit ? () => onEdit(product) : undefined}
          onDelete={onDelete ? () => onDelete(product) : undefined}
        />
      ))}
    </div>
  );
}

export default ProductGrid;
