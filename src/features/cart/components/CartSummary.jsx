import { Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import formatCurrency from '@shared/utils/formatCurrency';
import './CartSummary.css';

/**
 * Sticky order summary panel shown alongside the cart line items: item
 * count, subtotal, and a link to `/checkout` (disabled once the cart is
 * empty — e.g. after the last item is removed while this panel is visible).
 */
export function CartSummary() {
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getItemCount = useCartStore((state) => state.getItemCount);

  const isEmpty = items.length === 0;
  const itemCount = getItemCount();
  const subtotal = getSubtotal();

  return (
    <aside className="cart-summary">
      <h2 className="cart-summary__heading">Order Summary</h2>

      <div className="cart-summary__row">
        <span className="cart-summary__label">
          Items ({itemCount})
        </span>
        <span className="cart-summary__value tabular-nums">{formatCurrency(subtotal)}</span>
      </div>

      <div className="cart-summary__divider" />

      <div className="cart-summary__row cart-summary__row--total">
        <span className="cart-summary__label">Subtotal</span>
        <span className="cart-summary__value tabular-nums">{formatCurrency(subtotal)}</span>
      </div>

      <Link
        to="/checkout"
        className={`btn btn-primary cart-summary__checkout-btn${isEmpty ? ' disabled' : ''}`}
        aria-disabled={isEmpty}
        tabIndex={isEmpty ? -1 : undefined}
        onClick={(event) => {
          if (isEmpty) event.preventDefault();
        }}
      >
        Checkout
      </Link>
    </aside>
  );
}

export default CartSummary;
