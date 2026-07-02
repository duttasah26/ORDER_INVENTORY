import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { DataTable } from '@shared/components/common/DataTable';
import { useCustomers } from '@features/customers/hooks/useCustomers';
import { useStores } from '@features/stores/hooks/useStores';
import { formatDate } from '@shared/utils/helpers';
import { OrderStatus } from './OrderStatus';
import './OrderTable.css';

const DEFAULT_EMPTY_STATE = {
  icon: PackageSearch,
  heading: 'No orders yet',
  body: 'Orders will appear here once customers start ordering.',
};

/**
 * Wraps the shared `DataTable` for the order list. Deliberately has NO
 * total column - computing a per-row total would require an extra network
 * call per order (via `useInventoryOrderDetails`), and totals are already
 * prominent on the order detail page instead.
 *
 * @param {object} props
 * @param {Array<object>} props.orders
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {() => void} [props.onRetry]
 * @param {string} props.basePath - `/admin/orders` or `/my-orders`, so the
 *   "View" action stays context-agnostic.
 * @param {object} [props.emptyState] - overrides the default empty state
 *   (used to distinguish "no data" vs "no results" upstream).
 */
export function OrderTable({ orders, isLoading, isError, onRetry, basePath, emptyState }) {
  const { data: customers } = useCustomers();
  const { data: stores } = useStores();

  const customerNameById = new Map((customers ?? []).map((c) => [c.customer_id, c.full_name]));
  const storeNameById = new Map((stores ?? []).map((s) => [s.store_id, s.store_name]));

  const columns = [
    { key: 'order_id', header: 'Order ID' },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => customerNameById.get(row.customer_id) ?? `Customer #${row.customer_id}`,
    },
    {
      key: 'store',
      header: 'Store',
      render: (row) => storeNameById.get(row.store_id) ?? `Store #${row.store_id}`,
    },
    {
      key: 'order_tms',
      header: 'Date',
      render: (row) => formatDate(row.order_tms),
    },
    {
      key: 'order_status',
      header: 'Status',
      render: (row) => <OrderStatus status={row.order_status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <Link className="btn btn-sm btn-outline-secondary order-table__view" to={`${basePath}/${row.id}`}>
          View
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={orders ?? []}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyState={emptyState ?? DEFAULT_EMPTY_STATE}
      getRowKey={(row) => row.id}
    />
  );
}

export default OrderTable;
