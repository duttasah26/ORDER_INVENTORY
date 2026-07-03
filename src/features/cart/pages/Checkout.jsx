import { Navigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { CheckoutSummary } from '../components/CheckoutSummary';
import './Checkout.css';

/** `/checkout` — redirects back to `/cart` if there's nothing to check out. */
export function Checkout() {
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-page__heading">Checkout</h1>
      <CheckoutSummary />
    </div>
  );
}

export default Checkout;
