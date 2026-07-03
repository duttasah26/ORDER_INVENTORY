import { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getInitials, formatDate } from '@shared/utils/helpers';
import { getOrderStatusDisplay } from '@shared/utils/constants';
import { StatusBadge } from '@shared/components/common/StatusBadge';
import { Loader } from '@shared/components/common/Loader';
import { ErrorState } from '@shared/components/common/ErrorState';
import { EmptyState } from '@shared/components/common/EmptyState';
import { CustomerStatus } from '../components/CustomerStatus';
import { useCustomers, useCustomerOrders, useCustomerShipments } from '../hooks/useCustomers';
import './CustomerDetails.css';

/**
 * Simplified full-page version of the "customer detail drawer" concept —
 * no Offcanvas primitive exists in this build, so it's a normal routed page
 * instead of a slide-over. Intended route `/admin/customers/:id` (not yet
 * wired in app/routes.jsx — see feature notes).
 *
 * The customer is looked up from `useCustomers()`'s already-cached list by
 * `id`. There is no dedicated "get customer by id" endpoint (the server's
 * only single-customer lookup branches on email/name substring), so the
 * "fall back to a direct fetch" behavior is `useCustomers()` itself
 * performing a fresh network request when nothing is cached yet.
 */
export function CustomerDetails() {
  const { id } = useParams();
  const customerId = Number(id);

  const { data: customers, isLoading: isCustomersLoading } = useCustomers();
  const customer = useMemo(
    () => customers?.find((c) => c.id === customerId),
    [customers, customerId]
  );

  const custId = customer?.customer_id;
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
  } = useCustomerOrders(custId);
  const {
    data: shipmentsData,
    isLoading: isShipmentsLoading,
    isError: isShipmentsError,
    refetch: refetchShipments,
  } = useCustomerShipments(custId);

  if (isCustomersLoading) {
    return (
      <div className="customer-details__loading">
        <Loader />
      </div>
    );
  }

  if (!customer) {
    return (
      <EmptyState
        heading="Customer not found"
        body="This customer may have been deleted or the link is out of date."
      />
    );
  }

  return (
    <div className="customer-details">
      <Link to="/admin/customers" className="customer-details__back">
        <ArrowLeft size={16} strokeWidth={2} />
        Back to Customers
      </Link>

      <header className="customer-details__header">
        <span className="customer-details__avatar">{getInitials(customer.full_name)}</span>
        <div className="customer-details__identity">
          <h2 className="customer-details__name">{customer.full_name}</h2>
          <p className="customer-details__email">{customer.email_address}</p>
        </div>
        <CustomerStatus isblocked={customer.isblocked} />
      </header>

      <section className="customer-details__section">
        <h3 className="customer-details__section-title">Orders</h3>
        {isOrdersLoading ? (
          <Loader />
        ) : isOrdersError ? (
          <ErrorState body="Couldn't load orders for this customer." onRetry={refetchOrders} />
        ) : ordersData?.orders?.length ? (
          <ul className="customer-details__list">
            {ordersData.orders.map((order) => (
              <li key={order.id ?? order.order_id} className="customer-details__list-row">
                <span className="customer-details__list-primary">Order #{order.order_id}</span>
                <span className="customer-details__list-secondary">
                  {formatDate(order.order_tms)}
                </span>
                <StatusBadge
                  status={getOrderStatusDisplay(order.order_status).key}
                  label={getOrderStatusDisplay(order.order_status).label}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="customer-details__empty">No orders yet.</p>
        )}
      </section>

      <section className="customer-details__section">
        <h3 className="customer-details__section-title">Shipments</h3>
        {isShipmentsLoading ? (
          <Loader />
        ) : isShipmentsError ? (
          <ErrorState
            body="Couldn't load shipments for this customer."
            onRetry={refetchShipments}
          />
        ) : shipmentsData?.shipments?.length ? (
          <ul className="customer-details__list">
            {shipmentsData.shipments.map((shipment) => (
              <li key={shipment.id ?? shipment.shipment_id} className="customer-details__list-row">
                <span className="customer-details__list-primary">
                  {shipment.delivery_address}
                </span>
                <StatusBadge status={shipment.shipment_status} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="customer-details__empty">No shipments yet.</p>
        )}
      </section>
    </div>
  );
}

export default CustomerDetails;
