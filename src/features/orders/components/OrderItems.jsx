import { PackageSearch } from 'lucide-react';
import { useInventoryOrderDetails } from '@features/inventory/hooks/useInventory';
import { SkeletonRow } from '@shared/components/common/Skeleton';
import { EmptyState } from '@shared/components/common/EmptyState';
import { ErrorState } from '@shared/components/common/ErrorState';
import formatCurrency from '@shared/utils/formatCurrency';
import './OrderItems.css';

const COLUMN_COUNT = 5;

/**
 * Line-items table for a single order. Sources rows from the cross-feature
 * `useInventoryOrderDetails(orderId)` hook rather than a dedicated
 * order-items endpoint.
 *
 * @param {object} props
 * @param {string|number} props.orderId
 */
export function OrderItems({ orderId }) {
  const { data: items, isLoading, isError, refetch } = useInventoryOrderDetails(orderId);

  const isEmpty = !isLoading && !isError && (!items || items.length === 0);

  return (
    <div className="order-items">
      <h3 className="order-items__title">Items</h3>
      <div className="order-items__table-wrap">
        <table className="order-items__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Line Total</th>
              <th>Shipment</th>
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: 3 }, (_, index) => (
                  <SkeletonRow key={index} columns={COLUMN_COUNT} />
                ))
              : null}

            {!isLoading && isError ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  <ErrorState onRetry={refetch} />
                </td>
              </tr>
            ) : null}

            {isEmpty ? (
              <tr>
                <td colSpan={COLUMN_COUNT}>
                  <EmptyState
                    icon={PackageSearch}
                    heading="No items on this order"
                    body="This order doesn't have any line items yet."
                  />
                </td>
              </tr>
            ) : null}

            {!isLoading && !isError && items && items.length > 0
              ? items.map((item, index) => (
                  <tr key={item.product?.product_id ?? index} className="order-items__row">
                    <td>{item.product?.product_name ?? 'Unknown product'}</td>
                    <td>{item.quantity}</td>
                    <td>{formatCurrency(item.unitPrice)}</td>
                    <td>{formatCurrency(item.lineTotal)}</td>
                    <td>
                      {item.shipmentStatus ? (
                        <span className="order-items__shipment-status">
                          {item.shipmentStatus}
                        </span>
                      ) : (
                        <span className="order-items__shipment-status order-items__shipment-status--none">
                          Not shipped
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderItems;
