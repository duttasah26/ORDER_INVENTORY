import { useMemo, useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { useShipments } from '../hooks/useShipments';
import { ShipmentTable } from '../components/ShipmentTable';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All' },
  { value: 'CREATED', label: 'Created' },
  { value: 'SHIPPED', label: 'Shipped' },
  { value: 'DELIVERED', label: 'Delivered' },
];

/**
 * Route: /admin/shipments. Read-only list with a client-side status filter
 * — there is no server-side filter endpoint for shipments.
 */
export function Shipments() {
  const { data, isLoading, isError, refetch } = useShipments();
  const [statusFilter, setStatusFilter] = useState('ALL');

  const shipments = useMemo(() => {
    const all = data ?? [];
    if (statusFilter === 'ALL') {
      return all;
    }
    return all.filter((shipment) => shipment.shipment_status === statusFilter);
  }, [data, statusFilter]);

  return (
    <div className="shipments-page">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="h5 mb-0">Shipments</h2>

        <select
          className="form-select form-select-sm w-auto"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ShipmentTable
        shipments={shipments}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyState={{
          icon: PackageSearch,
          heading: 'No shipments found',
          body: 'Shipments will appear here once orders are fulfilled.',
        }}
      />
    </div>
  );
}

export default Shipments;
