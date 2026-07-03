import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { CartItem } from '../components/CartItem';
import { CartSummary } from '../components/CartSummary';
import { EmptyState } from '@shared/components/common/EmptyState';
import './Cart.css';

/** `/cart` — list of cart line items plus the sticky order summary. */
export function Cart() {
  const navigate = useNavigate();
  const items = useCartStore((state) => state.items);

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        heading="Your cart is empty"
        body="Browse products and add items to get started."
        action={{ label: 'Shop', onClick: () => navigate('/') }}
      />
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-page__heading">Your Cart</h1>

      <div className="cart-page__layout">
        <div className="cart-page__items">
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <CartSummary />
      </div>
    </div>
  );
}

export default Cart;
