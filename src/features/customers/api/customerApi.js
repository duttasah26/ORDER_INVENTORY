import api from '@shared/api/axios';
import { endpoints } from '@shared/api/endpoints';
import { dedupById } from '@shared/utils/helpers';
import { OVERDUE_SHIPMENT_THRESHOLD_DAYS } from '@shared/utils/constants';

async function fetchAll(endpoint) {
  const { data } = await api.get(endpoint);
  return data;
}

/**
 * Thin fetch wrappers around the `customers` endpoints. Each hook in
 * `hooks/useCustomers.js` / `hooks/useCustomerMutations.js` calls exactly one
 * of these. Composite views (shipment/order aggregates) fetch the underlying
 * collections and join/aggregate in JS, since bare json-server only serves
 * plain collections.
 */
export const customerApi = {
  getAll: () => api.get(endpoints.customers.all()).then((res) => res.data),

  getShipmentStatusCounts: async () => {
    const shipments = await fetchAll(endpoints.shipments.all());
    const counts = {};
    for (const s of shipments) {
      counts[s.shipment_status] = (counts[s.shipment_status] || 0) + 1;
    }
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  },

  getPendingShipments: async () => {
    const shipments = await fetchAll(endpoints.shipments.all());
    const pending = shipments.filter(
      (s) => s.shipment_status === 'CREATED' || s.shipment_status === 'SHIPPED'
    );
    const customerIds = new Set(pending.map((s) => s.customer_id));
    const customers = await fetchAll(endpoints.customers.all());
    return dedupById(customers.filter((c) => customerIds.has(c.customer_id)));
  },

  getOverdueShipments: async () => {
    const [shipments, orderItems, orders, customers] = await Promise.all([
      fetchAll(endpoints.shipments.all()),
      fetchAll(endpoints.orderItems.all()),
      fetchAll(endpoints.orders.all()),
      fetchAll(endpoints.customers.all()),
    ]);

    const now = Date.now();
    const thresholdMs = OVERDUE_SHIPMENT_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;
    const overdueCustomerIds = new Set();

    for (const shipment of shipments) {
      if (shipment.shipment_status === 'DELIVERED') continue;

      const relatedItem = orderItems.find((oi) => oi.shipment_id === shipment.shipment_id);
      if (!relatedItem) continue;

      const order = orders.find((o) => o.order_id === relatedItem.order_id);
      if (!order || !order.order_tms) continue;

      const orderTime = new Date(order.order_tms.replace(' ', 'T')).getTime();
      if (!Number.isFinite(orderTime)) continue;

      if (now - orderTime > thresholdMs) {
        overdueCustomerIds.add(shipment.customer_id);
      }
    }

    return dedupById(customers.filter((c) => overdueCustomerIds.has(c.customer_id)));
  },

  getCompletedOrders: async () => {
    const orders = await fetchAll(endpoints.orders.byStatus('COMPLETE'));
    const customerIds = new Set(orders.map((o) => o.customer_id));
    const customers = await fetchAll(endpoints.customers.all());
    return dedupById(customers.filter((c) => customerIds.has(c.customer_id)));
  },

  getByOrderQuantityRange: async (min, max) => {
    const [customers, orders, orderItems] = await Promise.all([
      fetchAll(endpoints.customers.all()),
      fetchAll(endpoints.orders.all()),
      fetchAll(endpoints.orderItems.all()),
    ]);

    return customers.filter((customer) => {
      const custOrders = orders.filter((o) => o.customer_id === customer.customer_id);
      const total = custOrders.reduce((sum, order) => {
        const items = orderItems.filter((oi) => oi.order_id === order.order_id);
        return sum + items.reduce((s, i) => s + (i.quantity || 0), 0);
      }, 0);
      return total >= min && total <= max;
    });
  },

  // { customer, orders: [...] }
  getOrders: async (custId) => {
    const customer = await api
      .get(endpoints.customers.byId(custId))
      .then((res) => res.data)
      .catch(() => null);
    if (!customer) {
      throw new Error('Orders for the specified customer ID not found.');
    }
    const orders = await fetchAll(endpoints.orders.byCustomerId(custId));
    return { customer, orders };
  },

  // { customer, shipments: [...] }
  getShipments: async (custId) => {
    const customer = await api
      .get(endpoints.customers.byId(custId))
      .then((res) => res.data)
      .catch(() => null);
    if (!customer) {
      throw new Error('Shipment history for the specified customer ID not found.');
    }
    const shipments = await fetchAll(endpoints.shipments.byCustomerId(custId));
    return { customer, shipments };
  },

  // Server branched on '@' -> email lookup, else name substring. Both
  // case-insensitive. Returns an array (possibly empty — not an error).
  lookup: async (emailOrName) => {
    const customers = await fetchAll(endpoints.customers.all());
    const query = String(emailOrName).toLowerCase();
    if (query.includes('@')) {
      return customers.filter((c) => String(c.email_address).toLowerCase() === query);
    }
    return customers.filter((c) => String(c.full_name).toLowerCase().includes(query));
  },

  // POST only auto-assigns `id`; every join in this app (orders.customer_id,
  // shipments.customer_id, the lookups above, etc.) keys off the domain
  // `customer_id` field, so backfill it immediately (mirrors the equivalent
  // fix applied to order creation in useOrderMutations.js).
  create: async (data) => {
    const { data: created } = await api.post(endpoints.customers.create(), data);
    if (created && created.customer_id === undefined) {
      await api.patch(endpoints.customers.update(created.id), { customer_id: created.id });
      created.customer_id = created.id;
    }
    return created;
  },

  update: ({ id, ...fields }) =>
    api.patch(endpoints.customers.update(id), fields).then((res) => res.data),

  remove: (customerId) =>
    api.delete(endpoints.customers.remove(customerId)).then((res) => res.data),
};

export default customerApi;
