import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '@features/auth/store/authStore';
import { useCreateOrder } from '@features/orders/hooks/useOrderMutations';
import { Loader } from '@shared/components/common/Loader';
import formatCurrency from '@shared/utils/formatCurrency';
import './CheckoutSummary.css';

// Customer web checkouts always go through the seeded "Online" store — there
// is no store-picker in the customer-facing flow.
const ONLINE_STORE_ID = 1;

/**
 * Read-only review of the cart contents shown on `/checkout`, with the
 * "Place Order" action that actually creates the order server-side.
 *
 * `useCreateOrder()` already toasts "Order placed." / the failure message on
 * settle, so this component only handles the cart-clearing + navigation
 * side-effects rather than toasting a second time.
 */
export function CheckoutSummary() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const user = useAuthStore((state) => state.user);
  const createOrder = useCreateOrder();

  const subtotal = getSubtotal();
  // No tax/shipping fee model exists yet, so total equals subtotal.
  const total = subtotal;

  async function handlePlaceOrder() {
    try {
      const createdOrder = await createOrder.mutateAsync({
        customerId: user.id,
        storeId: ONLINE_STORE_ID,
        items: items.map((item) => ({
          productId: item.productId,
          unitPrice: item.unitPrice,
          quantity: item.quantity,
        })),
      });
      // Navigate away from /checkout BEFORE clearing the cart: the parent
      // Checkout page redirects to /cart whenever the cart is empty, so
      // clearing first (while still mounted on /checkout) raced against
      // this navigation and the empty-cart redirect could win, stranding
      // the user on /cart instead of the new order's detail page.
      navigate(`/my-orders/${createdOrder.id}`);
      // Defer clearCart to a macrotask: navigate() and clearCart() firing in
      // the same tick both update state Checkout depends on (route + cart),
      // and React can still commit an intermediate render of Checkout with
      // the cart already empty but the route not yet switched, which fires
      // Checkout's own "redirect to /cart when empty" guard and wins the
      // race against the intended navigation. Letting the route change
      // fully commit first (Checkout unmounts) before clearing the cart
      // avoids that guard ever seeing the empty cart.
      setTimeout(() => clearCart(), 0);
    } catch {
      // Toast already surfaced by the mutation's onError.
    }
  }

  return (
    <div className="checkout-summary">
      <h2 className="checkout-summary__heading">Review Your Order</h2>

      <ul className="checkout-summary__list">
        {items.map((item) => (
          <li key={item.productId} className="checkout-summary__item">
            <span
              className="checkout-summary__colour-dot"
              style={{ background: item.colour }}
              aria-hidden="true"
            />
            <span className="checkout-summary__item-name">{item.productName}</span>
            <span className="checkout-summary__item-qty tabular-nums">x{item.quantity}</span>
            <span className="checkout-summary__item-total tabular-nums">
              {formatCurrency(item.unitPrice * item.quantity)}
            </span>
          </li>
        ))}
      </ul>

      <div className="checkout-summary__divider" />

      <div className="checkout-summary__row">
        <span>Subtotal</span>
        <span className="tabular-nums">{formatCurrency(subtotal)}</span>
      </div>
      <div className="checkout-summary__row checkout-summary__row--total">
        <span>Total</span>
        <span className="tabular-nums">{formatCurrency(total)}</span>
      </div>

      <button
        type="button"
        className="btn btn-primary checkout-summary__place-order-btn"
        onClick={handlePlaceOrder}
        disabled={createOrder.isPending}
      >
        {createOrder.isPending ? <Loader size="sm" /> : null}
        Place Order
      </button>
    </div>
  );
}

export default CheckoutSummary;
