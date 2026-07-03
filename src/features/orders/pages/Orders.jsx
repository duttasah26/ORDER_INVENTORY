import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, PackageSearch, SearchX, X } from 'lucide-react';

import { Modal } from '@shared/components/common/Modal';
import { useFiltersStore } from '@stores/filtersStore';
import { useAuthStore } from '@features/auth/store/authStore';
import { useOrderDraftStore } from '@stores/orderDraftStore';
import { useCustomers } from '@features/customers/hooks/useCustomers';
import { useStores } from '@features/stores/hooks/useStores';
import { useProducts } from '@features/products/hooks/useProducts';
import { ORDER_STATUSES, ORDER_STATUS_DISPLAY_MAP } from '@shared/utils/constants';
import formatCurrency from '@shared/utils/formatCurrency';

import { useOrders } from '../hooks/useOrders';
import { useCreateOrder } from '../hooks/useOrderMutations';
import { orderSchema } from '../validation/orderSchema';
import { OrderTable } from '../components/OrderTable';
import { OrderCard } from '../components/OrderCard';

// Note on styling: `architecture.txt` lists only `Orders.jsx`/`OrderDetails.jsx`
// for pages (no companion `.css`), so layout here leans entirely on the
// globally-loaded Bootstrap CSS utility/component classes rather than
// bespoke classnames.

function statusKeyOf(order) {
  return ORDER_STATUS_DISPLAY_MAP[order.order_status]?.key ?? order.order_status;
}

function NewOrderModal({ isOpen, onClose }) {
  const { data: customers } = useCustomers();
  const { data: stores } = useStores();
  const { data: products } = useProducts();
  const navigate = useNavigate();
  const createOrder = useCreateOrder();

  const customerId = useOrderDraftStore((s) => s.customerId);
  const storeId = useOrderDraftStore((s) => s.storeId);
  const lines = useOrderDraftStore((s) => s.lines);
  const setCustomer = useOrderDraftStore((s) => s.setCustomer);
  const setStore = useOrderDraftStore((s) => s.setStore);
  const addLine = useOrderDraftStore((s) => s.addLine);
  const removeLine = useOrderDraftStore((s) => s.removeLine);
  const reset = useOrderDraftStore((s) => s.reset);
  const getTotal = useOrderDraftStore((s) => s.getTotal);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [formError, setFormError] = useState('');

  const productById = new Map((products ?? []).map((p) => [p.product_id, p]));

  function handleAddLine() {
    const product = productById.get(Number(selectedProductId));
    if (!product || !quantity || Number(quantity) < 1) return;
    addLine({
      productId: product.product_id,
      unitPrice: product.unit_price,
      quantity: Number(quantity),
    });
    setSelectedProductId('');
    setQuantity(1);
  }

  function handleClose() {
    setFormError('');
    onClose();
  }

  async function handleSubmit() {
    setFormError('');
    try {
      orderSchema.validateSync({ customerId, storeId, lines }, { abortEarly: true });
    } catch (validationError) {
      setFormError(validationError.message);
      return;
    }

    try {
      const created = await createOrder.mutateAsync({
        customerId,
        storeId,
        items: lines.map((line) => ({
          productId: line.productId,
          unitPrice: line.unitPrice,
          quantity: line.quantity,
        })),
      });
      reset();
      onClose();
      navigate(`/admin/orders/${created.id}`);
    } catch {
      // Toast already surfaced by useCreateOrder's onError.
    }
  }

  const canSubmit = Boolean(customerId) && Boolean(storeId) && lines.length > 0;

  const footer = (
    <div className="d-flex justify-content-end gap-2">
      <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
        Cancel
      </button>
      <button
        type="button"
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={!canSubmit || createOrder.isPending}
      >
        {createOrder.isPending ? 'Submitting…' : 'Submit Order'}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="New Order" size="lg" footer={footer}>
      {formError ? <div className="alert alert-danger py-2">{formError}</div> : null}

      <div className="row g-3 mb-3">
        <div className="col-md-6">
          <label className="form-label">Customer</label>
          <select
            className="form-select"
            value={customerId ?? ''}
            onChange={(event) => setCustomer(event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">Select a customer…</option>
            {(customers ?? []).map((customer) => (
              <option key={customer.customer_id} value={customer.customer_id}>
                {customer.full_name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Store</label>
          <select
            className="form-select"
            value={storeId ?? ''}
            onChange={(event) => setStore(event.target.value ? Number(event.target.value) : null)}
          >
            <option value="">Select a store…</option>
            {(stores ?? []).map((store) => (
              <option key={store.store_id} value={store.store_id}>
                {store.store_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="d-flex gap-2 align-items-end mb-3">
        <div className="flex-grow-1">
          <label className="form-label">Product</label>
          <select
            className="form-select"
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            <option value="">Select a product…</option>
            {(products ?? []).map((product) => (
              <option key={product.product_id} value={product.product_id}>
                {product.product_name} ({formatCurrency(product.unit_price)})
              </option>
            ))}
          </select>
        </div>

        <div style={{ width: 90 }}>
          <label className="form-label">Qty</label>
          <input
            type="number"
            className="form-control"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={handleAddLine}
          disabled={!selectedProductId}
        >
          Add
        </button>
      </div>

      {lines.length > 0 ? (
        <ul className="list-group mb-3">
          {lines.map((line) => {
            const product = productById.get(line.productId);
            return (
              <li
                key={line.productId}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>
                  {product?.product_name ?? `Product #${line.productId}`}
                  <span className="text-muted"> x{line.quantity}</span>
                </span>
                <span className="d-flex align-items-center gap-3">
                  <span className="fw-semibold">{formatCurrency(line.unitPrice * line.quantity)}</span>
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger"
                    aria-label={`Remove ${product?.product_name ?? 'line'}`}
                    onClick={() => removeLine(line.productId)}
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-muted mb-3">No product lines added yet.</p>
      )}

      <div className="d-flex justify-content-between align-items-center border-top pt-3">
        <span className="fw-semibold">Total</span>
        <span className="fs-4 fw-bold">{formatCurrency(getTotal())}</span>
      </div>
    </Modal>
  );
}

function AdminOrders() {
  const { data: orders, isLoading, isError, refetch } = useOrders();
  const { data: stores } = useStores();
  const filters = useFiltersStore((s) => s.orders);
  const setFilters = useFiltersStore((s) => s.setFilters);
  const resetFilters = useFiltersStore((s) => s.resetFilters);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    let list = orders ?? [];
    if (filters.status) {
      list = list.filter((order) => statusKeyOf(order) === filters.status);
    }
    if (filters.store) {
      list = list.filter((order) => String(order.store_id) === String(filters.store));
    }
    if (filters.dateFrom) {
      list = list.filter((order) => (order.order_tms ?? '').slice(0, 10) >= filters.dateFrom);
    }
    if (filters.dateTo) {
      list = list.filter((order) => (order.order_tms ?? '').slice(0, 10) <= filters.dateTo);
    }
    return list;
  }, [orders, filters]);

  const hasActiveFilters = Boolean(
    filters.status || filters.store || filters.dateFrom || filters.dateTo
  );

  const emptyState =
    orders && orders.length === 0
      ? {
          icon: PackageSearch,
          heading: 'No orders yet',
          body: 'Orders will appear here once customers start ordering.',
        }
      : hasActiveFilters && filteredOrders.length === 0
        ? {
            icon: SearchX,
            heading: 'No orders match your filters',
            body: 'Clear filters to see all orders.',
            action: { label: 'Clear filters', onClick: () => resetFilters('orders') },
          }
        : undefined;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Orders</h1>
        <button type="button" className="btn btn-primary d-inline-flex align-items-center gap-1" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} /> New Order
        </button>
      </div>

      <ul className="nav nav-pills mb-3">
        <li className="nav-item">
          <button
            type="button"
            className={`nav-link ${!filters.status ? 'active' : ''}`}
            onClick={() => setFilters('orders', { status: '' })}
          >
            All
          </button>
        </li>
        {ORDER_STATUSES.map((status) => (
          <li className="nav-item" key={status}>
            <button
              type="button"
              className={`nav-link ${filters.status === status ? 'active' : ''}`}
              onClick={() => setFilters('orders', { status })}
            >
              {ORDER_STATUS_DISPLAY_MAP[status]?.label ?? status}
            </button>
          </li>
        ))}
      </ul>

      <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
        <select
          className="form-select"
          style={{ maxWidth: 220 }}
          value={filters.store}
          onChange={(event) => setFilters('orders', { store: event.target.value })}
        >
          <option value="">All stores</option>
          {(stores ?? []).map((store) => (
            <option key={store.store_id} value={store.store_id}>
              {store.store_name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="form-control"
          style={{ maxWidth: 170 }}
          value={filters.dateFrom}
          onChange={(event) => setFilters('orders', { dateFrom: event.target.value })}
        />
        <span className="text-muted">to</span>
        <input
          type="date"
          className="form-control"
          style={{ maxWidth: 170 }}
          value={filters.dateTo}
          onChange={(event) => setFilters('orders', { dateTo: event.target.value })}
        />

        {hasActiveFilters ? (
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => resetFilters('orders')}
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <OrderTable
        orders={filteredOrders}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        basePath="/admin/orders"
        emptyState={emptyState}
      />

      <NewOrderModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />
    </div>
  );
}

const CUSTOMER_TABS = ['ALL', 'PENDING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function CustomerOrders() {
  const user = useAuthStore((s) => s.user);
  const { data: allOrders, isLoading, isError, refetch } = useOrders();
  const { data: stores } = useStores();
  const [activeTab, setActiveTab] = useState('ALL');

  const storeNameById = new Map((stores ?? []).map((s) => [s.store_id, s.store_name]));

  const myOrders = (allOrders ?? []).filter((order) => order.customer_id === user?.id);
  const tabFiltered =
    activeTab === 'ALL' ? myOrders : myOrders.filter((order) => statusKeyOf(order) === activeTab);

  return (
    <div>
      <h1 className="h3 mb-4">My Orders</h1>

      <ul className="nav nav-pills mb-3">
        {CUSTOMER_TABS.map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              type="button"
              className={`nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'ALL' ? 'All' : ORDER_STATUS_DISPLAY_MAP[tab]?.label ?? tab}
            </button>
          </li>
        ))}
      </ul>

      {isLoading ? (
        <p className="text-muted">Loading your orders…</p>
      ) : isError ? (
        <div className="text-center py-5">
          <p className="text-muted">We couldn't load your orders.</p>
          <button type="button" className="btn btn-outline-secondary" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      ) : tabFiltered.length === 0 ? (
        <div className="text-center py-5 text-muted">
          {myOrders.length === 0
            ? 'No orders yet. Orders will appear here once you place one.'
            : 'No orders in this category.'}
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {tabFiltered.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              storeName={storeNameById.get(order.store_id)}
              basePath="/my-orders"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Orders() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  return isAdmin ? <AdminOrders /> : <CustomerOrders />;
}
