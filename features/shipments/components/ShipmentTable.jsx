import { Link } from 'react-router-dom';
import DataTable from '@shared/components/common/DataTable';
import { useStores } from '@features/stores/hooks/useStores';
import { useCustomers } from '@features/customers/hooks/useCustomers';
import { ShipmentStatus } from './ShipmentStatus';
import './ShipmentTable.css';

function findStoreName(stores, storeId) {
  const store = stores?.find((item) => item.store_id === storeId);
  return store?.store_name ?? '—';
}

function findCustomerName(customers, customerId) {
  const customer = customers?.find((item) => item.customer_id === customerId);
  return customer?.full_name ?? '—';
}

/**
 * Wraps the shared DataTable for the shipments collection. Store/customer
 * names are joined client-side against the store_id/customer_id foreign
 * keys using the other features' hooks.
 *
 * @param {object} props
 * @param {Array<object>} props.shipments
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {() => void} [props.onRetry]
 * @param {object} [props.emptyState]
 */
export function ShipmentTable({ shipments, isLoading, isError, onRetry, emptyState }) {
  const { data: stores } = useStores();
  const { data: customers } = useCustomers();

  const columns = [
    { key: 'shipment_id', header: 'Shipment ID' },
    { key: 'delivery_address', header: 'Delivery Address' },
    {
      key: 'store',
      header: 'Store',
      render: (row) => findStoreName(stores, row.store_id),
    },
    {
      key: 'customer',
      header: 'Customer',
      render: (row) => findCustomerName(customers, row.customer_id),
    },
    {
      key: 'shipment_status',
      header: 'Status',
      render: (row) => <ShipmentStatus status={row.shipment_status} />,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <Link
          to={`/admin/shipments/${row.id}`}
          className="btn btn-sm btn-outline-secondary shipment-table__view"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={shipments ?? []}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyState={emptyState}
      getRowKey={(row) => row.id}
    />
  );
}

export default ShipmentTable;
