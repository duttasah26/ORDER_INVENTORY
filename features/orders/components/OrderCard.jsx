import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import { formatDate } from '@shared/utils/helpers';
import { OrderStatus } from './OrderStatus';
import './OrderCard.css';

/**
 * Customer-facing order card for `/my-orders`.
 *
 * @param {object} props
 * @param {object} props.order - raw order row `{id, order_id, order_tms, customer_id, order_status, store_id}`
 * @param {string} [props.storeName] - resolved client-side against `useStores()`
 * @param {string} props.basePath - `/my-orders`
 */
export function OrderCard({ order, storeName, basePath }) {
  return (
    <div className="order-card">
      <div className="order-card__header">
        <span className="order-card__id">Order #{order.order_id}</span>
        <OrderStatus status={order.order_status} />
      </div>

      <div className="order-card__body">
        <div className="order-card__row">
          <span className="order-card__label">Placed</span>
          <span>{formatDate(order.order_tms)}</span>
        </div>
        <div className="order-card__row">
          <span className="order-card__label">
            <Store size={14} strokeWidth={1.75} aria-hidden="true" /> Store
          </span>
          <span>{storeName ?? `Store #${order.store_id}`}</span>
        </div>
      </div>

      <Link className="btn btn-outline-secondary order-card__link" to={`${basePath}/${order.id}`}>
        View Order
      </Link>
    </div>
  );
}

export default OrderCard;
