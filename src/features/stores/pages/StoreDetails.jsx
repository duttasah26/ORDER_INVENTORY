import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Loader } from '@shared/components/common/Loader';
import { ErrorState } from '@shared/components/common/ErrorState';
import { EmptyState } from '@shared/components/common/EmptyState';
import { StatusBadge } from '@shared/components/common/StatusBadge';
import { useInventory } from '@features/inventory/hooks/useInventory';
import { useOrdersByStore } from '@features/orders/hooks/useOrders';
import { StoreCard } from '../components/StoreCard';
import { useStore } from '../hooks/useStores';
import './StoreDetails.css';

/**
 * "Inventory at this store" + "Orders at this store" sections. Split out
 * into its own component so its cross-feature hooks (`useInventory`,
 * `useOrdersByStore`) only ever run once the store itself has resolved —
 * avoids `useInventory(undefined)` firing an unfiltered "all inventory"
 * fetch while the store lookup is still in flight.
 */
function StoreDetailSections({ store }) {
  const {
    data: inventoryRows,
    isLoading: isInventoryLoading,
    isError: isInventoryError,
    refetch: refetchInventory,
  } = useInventory(store.store_id);

  const {
    data: storeOrders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useOrdersByStore(store.store_name);

  return (
    <>
      <section className="store-details__section">
        <h3 className="store-details__section-title">Inventory at this store</h3>
        {isInventoryLoading ? (
          <Loader />
        ) : isInventoryError ? (
          <ErrorState body="Couldn't load inventory for this store." onRetry={refetchInventory} />
        ) : inventoryRows?.length ? (
          <table className="store-details__table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRows.map((row) => (
                <tr key={row.id ?? row.inventory_id}>
                  <td>{row.product?.product_name ?? 'Unknown product'}</td>
                  <td>{row.product_inventory}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="store-details__empty">No inventory recorded for this store.</p>
        )}
      </section>

      <section className="store-details__section">
        <h3 className="store-details__section-title">Orders at this store</h3>
        {isOrdersLoading ? (
          <Loader />
        ) : isOrdersError ? (
          <ErrorState body="Couldn't load orders for this store." onRetry={refetchOrders} />
        ) : storeOrders?.length ? (
          <ul className="store-details__list">
            {storeOrders.map((order) => (
              <li key={order.orderid} className="store-details__list-row">
                <span className="store-details__list-primary">Order #{order.orderid}</span>
                <StatusBadge status={order.orderstatus} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="store-details__empty">No orders yet for this store.</p>
        )}
      </section>
    </>
  );
}

/**
 * Admin store detail page — route `/admin/stores/:id`. Read-only: a
 * `StoreCard`-style header for the store itself, plus its inventory and
 * orders pulled in via the Inventory and Orders features' cross-feature
 * hooks.
 */
export function StoreDetails() {
  const { id } = useParams();
  const { data: store, isLoading, isError, refetch } = useStore(id);

  if (isLoading) {
    return (
      <div className="store-details__loading">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <ErrorState body="Couldn't load this store." onRetry={refetch} />;
  }

  if (!store) {
    return (
      <EmptyState
        heading="Store not found"
        body="This store may have been removed or the link is out of date."
      />
    );
  }

  return (
    <div className="store-details">
      <Link to="/admin/stores" className="store-details__back">
        <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
        Back to Stores
      </Link>

      <StoreCard store={store} />

      <StoreDetailSections store={store} />
    </div>
  );
}

export default StoreDetails;
