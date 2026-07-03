import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useShipment } from '../hooks/useShipments';
import { useStores } from '@features/stores/hooks/useStores';
import { useCustomers } from '@features/customers/hooks/useCustomers';
import { ShipmentStatus } from '../components/ShipmentStatus';
import { ShipmentTimeline } from '../components/ShipmentTimeline';
import { Loader } from '@shared/components/common/Loader';
import { ErrorState } from '@shared/components/common/ErrorState';

/**
 * Route: /admin/shipments/:id. Read-only detail view — there is no real
 * update endpoint for shipments (see useShipmentMutations.js), so no edit
 * controls are rendered here.
 */
export function ShipmentDetails() {
  const { id } = useParams();
  const { data: shipment, isLoading, isError, refetch } = useShipment(id);
  const { data: stores } = useStores();
  const { data: customers } = useCustomers();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !shipment) {
    return <ErrorState onRetry={refetch} />;
  }

  const store = stores?.find((item) => item.store_id === shipment.store_id);
  const customer = customers?.find((item) => item.customer_id === shipment.customer_id);

  return (
    <div className="shipment-details-page">
      <Link to="/admin/shipments" className="btn btn-sm btn-outline-secondary mb-3">
        <ArrowLeft size={16} strokeWidth={2} className="me-1" aria-hidden="true" />
        Back to shipments
      </Link>

      <div className="card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h2 className="h5 mb-0">Shipment #{shipment.shipment_id}</h2>
          <ShipmentStatus status={shipment.shipment_status} />
        </div>

        <dl className="row mb-0">
          <dt className="col-sm-3">Delivery address</dt>
          <dd className="col-sm-9">{shipment.delivery_address}</dd>

          <dt className="col-sm-3">Store</dt>
          <dd className="col-sm-9">{store?.store_name ?? '—'}</dd>

          <dt className="col-sm-3">Customer</dt>
          <dd className="col-sm-9">{customer?.full_name ?? '—'}</dd>
        </dl>
      </div>

      <div className="card p-4">
        <h3 className="h6 mb-3">Progress</h3>
        <ShipmentTimeline status={shipment.shipment_status} />
      </div>
    </div>
  );
}

export default ShipmentDetails;
