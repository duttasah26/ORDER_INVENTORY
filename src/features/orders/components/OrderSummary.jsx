import { useInventoryOrderDetails } from '@features/inventory/hooks/useInventory';
import { Skeleton } from '@shared/components/common/Skeleton';
import formatCurrency from '@shared/utils/formatCurrency';
import './OrderSummary.css';

/**
 * Subtotal/total recap panel for a single order. Uses the SAME
 * `useInventoryOrderDetails(orderId)` data as `OrderItems` (summing
 * `lineTotal`) rather than re-fetching. The dataset has no separate
 * tax/shipping fields, so total == subtotal here.
 *
 * @param {object} props
 * @param {string|number} props.orderId
 */
export function OrderSummary({ orderId }) {
  const { data: items, isLoading } = useInventoryOrderDetails(orderId);

  const itemCount = (items ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const subtotal = (items ?? []).reduce((sum, item) => sum + (item.lineTotal ?? 0), 0);

  return (
    <div className="order-summary">
      <h3 className="order-summary__title">Order Summary</h3>

      <div className="order-summary__row">
        <span className="order-summary__label">Items</span>
        {isLoading ? <Skeleton width={40} height={14} /> : <span>{itemCount}</span>}
      </div>

      <div className="order-summary__row">
        <span className="order-summary__label">Subtotal</span>
        {isLoading ? (
          <Skeleton width={64} height={14} />
        ) : (
          <span>{formatCurrency(subtotal)}</span>
        )}
      </div>

      <div className="order-summary__divider" />

      <div className="order-summary__row order-summary__row--total">
        <span className="order-summary__label">Total Amount</span>
        {isLoading ? (
          <Skeleton width={96} height={28} />
        ) : (
          <span className="order-summary__total-value">{formatCurrency(subtotal)}</span>
        )}
      </div>
    </div>
  );
}

export default OrderSummary;
