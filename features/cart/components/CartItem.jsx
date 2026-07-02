import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import formatCurrency from '@shared/utils/formatCurrency';
import './CartItem.css';

/**
 * One cart line: colour swatch, product name, quantity stepper, unit price,
 * and line total. Newly-added rows animate in (mount-only CSS animation);
 * removal fades + collapses before actually mutating the store so the
 * layout shift doesn't feel abrupt.
 *
 * @param {object} props
 * @param {{productId: number, productName: string, unitPrice: number, colour: string, quantity: number}} props.item
 */
export function CartItem({ item }) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const [isRemoving, setIsRemoving] = useState(false);

  const lineTotal = item.unitPrice * item.quantity;

  function handleRemove() {
    if (isRemoving) return;
    setIsRemoving(true);
    setTimeout(() => {
      removeItem(item.productId);
    }, 200);
  }

  function handleDecrement() {
    if (item.quantity <= 1) {
      handleRemove();
      return;
    }
    updateQuantity(item.productId, item.quantity - 1);
  }

  function handleIncrement() {
    updateQuantity(item.productId, item.quantity + 1);
  }

  return (
    <div className={`cart-item${isRemoving ? ' cart-item--exiting' : ''}`}>
      <span
        className="cart-item__colour-dot"
        style={{ background: item.colour }}
        aria-hidden="true"
      />

      <div className="cart-item__info">
        <p className="cart-item__name">{item.productName}</p>
        <p className="cart-item__unit-price">{formatCurrency(item.unitPrice)} each</p>
      </div>

      <div className="cart-item__stepper">
        <button
          type="button"
          className="cart-item__step-btn"
          onClick={handleDecrement}
          aria-label="Decrease quantity"
        >
          <Minus size={14} strokeWidth={2} />
        </button>
        <span className="cart-item__quantity tabular-nums">{item.quantity}</span>
        <button
          type="button"
          className="cart-item__step-btn"
          onClick={handleIncrement}
          aria-label="Increase quantity"
        >
          <Plus size={14} strokeWidth={2} />
        </button>
      </div>

      <p className="cart-item__line-total tabular-nums">{formatCurrency(lineTotal)}</p>

      <button
        type="button"
        className="cart-item__remove"
        onClick={handleRemove}
        aria-label="Remove item"
      >
        <Trash2 size={16} strokeWidth={1.75} />
      </button>
    </div>
  );
}

export default CartItem;
