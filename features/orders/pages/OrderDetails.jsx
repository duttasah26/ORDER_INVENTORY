import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

import { Loader } from '@shared/components/common/Loader';
import { ErrorState } from '@shared/components/common/ErrorState';
import { ConfirmDialog } from '@shared/components/common/ConfirmDialog';
import { useAuthStore } from '@features/auth/store/authStore';
import { formatDate } from '@shared/utils/helpers';
import { ORDER_STATUS_DISPLAY_MAP } from '@shared/utils/constants';

import { useOrder } from '../hooks/useOrders';
import { useUpdateOrder, useCancelOrder } from '../hooks/useOrderMutations';
import { OrderStatusStepper } from '../components/OrderStatus';
import { OrderItems } from '../components/OrderItems';
import { OrderSummary } from '../components/OrderSummary';

// Forward lifecycle used for the "advance status" control. Raw seed data
// only ever contains CANCELLED/COMPLETE, but going forward we PUT these
// canonical values directly as `order_status` - the server just stores
// whatever string it's given.
const FORWARD_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function OrderDetails() {
  const { id } = useParams();
  const user = useAuthStore((s) => s.user);
  const { data: order, isLoading, isError, refetch } = useOrder(id);
  const updateOrder = useUpdateOrder();
  const cancelOrder = useCancelOrder(id);
  const [isCancelOpen, setIsCancelOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Loader />
      </div>
    );
  }

  if (isError || !order) {
    return <ErrorState onRetry={refetch} />;
  }

  const displayKey = ORDER_STATUS_DISPLAY_MAP[order.order_status]?.key ?? order.order_status;
  const isAdmin = user?.role === 'admin';
  const canCancel = displayKey !== 'DELIVERED' && displayKey !== 'CANCELLED';

  const currentIndex = FORWARD_STEPS.indexOf(displayKey);
  const nextStatus =
    currentIndex >= 0 && currentIndex < FORWARD_STEPS.length - 1
      ? FORWARD_STEPS[currentIndex + 1]
      : null;

  function handleAdvance() {
    if (!nextStatus) return;
    updateOrder.mutate({ id: order.id, order_status: nextStatus });
  }

  function handleCancelConfirm() {
    cancelOrder.mutate(undefined, {
      onSuccess: () => setIsCancelOpen(false),
    });
  }

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <div>
          <h1 className="h3 mb-1">Order #{order.order_id}</h1>
          <div className="text-muted small d-flex flex-wrap gap-3">
            <span>Customer: {order.customer?.full_name ?? `#${order.customer_id}`}</span>
            <span>Store: {order.store?.store_name ?? `#${order.store_id}`}</span>
            <span>Placed: {formatDate(order.order_tms)}</span>
          </div>
        </div>

        <div className="d-flex gap-2">
          {isAdmin && nextStatus ? (
            <button
              type="button"
              className="btn btn-primary d-inline-flex align-items-center gap-1"
              onClick={handleAdvance}
              disabled={updateOrder.isPending}
            >
              Advance to {ORDER_STATUS_DISPLAY_MAP[nextStatus]?.label ?? nextStatus}
              <ChevronRight size={16} strokeWidth={2} />
            </button>
          ) : null}

          {canCancel ? (
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => setIsCancelOpen(true)}
            >
              Cancel Order
            </button>
          ) : null}
        </div>
      </div>

      <div className="mb-4">
        <OrderStatusStepper status={order.order_status} />
      </div>

      <div className="d-flex flex-wrap gap-3">
        <OrderItems orderId={order.order_id} />
        <OrderSummary orderId={order.order_id} />
      </div>

      <ConfirmDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onConfirm={handleCancelConfirm}
        title="Cancel this order?"
        body="The order status will be set to Cancelled. This cannot be undone."
        confirmLabel="Cancel Order"
        cancelLabel="Keep Order"
        isDestructive
        isPending={cancelOrder.isPending}
      />
    </div>
  );
}
