export const ORDER_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

// Maps RAW backend order_status values to a canonical display status + label.
// The seed data only contains CANCELLED/COMPLETE, so COMPLETE maps to the
// canonical DELIVERED status for display purposes.
export const ORDER_STATUS_DISPLAY_MAP = {
  CANCELLED: { key: 'CANCELLED', label: 'Cancelled' },
  COMPLETE: { key: 'DELIVERED', label: 'Delivered' },
  PENDING: { key: 'PENDING', label: 'Pending' },
  PROCESSING: { key: 'PROCESSING', label: 'Processing' },
  SHIPPED: { key: 'SHIPPED', label: 'Shipped' },
  DELIVERED: { key: 'DELIVERED', label: 'Delivered' },
};

export function getOrderStatusDisplay(rawStatus) {
  return ORDER_STATUS_DISPLAY_MAP[rawStatus] || { key: rawStatus, label: rawStatus };
}

export const SHIPMENT_STATUSES = ['CREATED', 'SHIPPED', 'DELIVERED'];

export const STATUS_COLORS = {
  PENDING: 'var(--color-status-pending)',
  PROCESSING: 'var(--color-status-processing)',
  SHIPPED: 'var(--color-status-shipped)',
  DELIVERED: 'var(--color-status-delivered)',
  CANCELLED: 'var(--color-status-cancelled)',
  LOWSTOCK: 'var(--color-status-lowstock)',
};

export const LOW_STOCK_THRESHOLD = 15; // units

// The `shipments` collection in db.json has no timestamp field of its own
// (no `created_at` / `shipped_at`), so there is no real data point to compute
// "overdue" from directly. To still support a useful "overdue shipments"
// business view, we approximate a shipment's age via the `order_tms` of the
// order it is linked to (shipment -> order_items.shipment_id -> order_items.order_id
// -> orders.order_tms). This constant is a fabricated business rule (not derived
// from the dataset) used purely to define what "overdue" means for that view.
export const OVERDUE_SHIPMENT_THRESHOLD_DAYS = 14;
