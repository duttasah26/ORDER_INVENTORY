// The `shipments` collection in db.json has no timestamp field of its own
// (no `created_at` / `shipped_at`), so there is no real data point to compute
// "overdue" from directly. To still support a useful "overdue shipments"
// business view, we approximate a shipment's age via the `order_tms` of the
// order it is linked to (shipment -> order_items.shipment_id -> order_items.order_id
// -> orders.order_tms). This constant is a fabricated business rule (not derived
// from the dataset) used purely to define what "overdue" means for that endpoint.
export const OVERDUE_SHIPMENT_THRESHOLD_DAYS = 14;
