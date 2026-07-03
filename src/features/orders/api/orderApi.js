import axios from '@shared/api/axios';
import endpoints from '@shared/api/endpoints';
import { customerApi } from '@features/customers/api/customerApi';

/**
 * Thin wrapper around the `orders` REST surface. Hooks in
 * `features/orders/hooks/*` are the only intended callers - components
 * should go through those, not this module directly.
 */

async function fetchAll(endpoint) {
  const { data } = await axios.get(endpoint);
  return data;
}

export async function getAllOrders() {
  return fetchAll(endpoints.orders.all());
}

// Joined order detail: `{...order, customer, store, items: [{...item, product}]}`.
export async function getOrder(id) {
  const { data: order } = await axios.get(endpoints.orders.byId(id));

  const [customer, store, items, products] = await Promise.all([
    axios.get(endpoints.customers.byId(order.customer_id)).then((r) => r.data).catch(() => null),
    axios.get(endpoints.stores.byId(order.store_id)).then((r) => r.data).catch(() => null),
    fetchAll(endpoints.orderItems.byOrderId(order.order_id)),
    fetchAll(endpoints.products.all()),
  ]);

  const productsById = new Map(products.map((p) => [p.product_id, p]));
  const itemsWithProduct = items.map((item) => ({
    ...item,
    product: productsById.get(item.product_id) || null,
  }));

  return { ...order, customer, store, items: itemsWithProduct };
}

// Store-name lookup: array of `{orderid, orderstatus, storename, webaddress}`.
export async function getOrdersByStore(storeName) {
  const stores = await fetchAll(endpoints.stores.all());
  const store = stores.find(
    (s) => String(s.store_name).toLowerCase() === String(storeName).toLowerCase()
  );
  if (!store) {
    return [];
  }

  const storeOrders = await fetchAll(endpoints.orders.byStoreId(store.store_id));
  return storeOrders.map((order) => ({
    orderid: order.order_id,
    orderstatus: order.order_status,
    storename: store.store_name,
    webaddress: store.web_address,
  }));
}

export async function getOrderStatusCounts() {
  const orders = await fetchAll(endpoints.orders.all());
  const counts = {};
  for (const o of orders) {
    counts[o.order_status] = (counts[o.order_status] || 0) + 1;
  }
  return Object.entries(counts).map(([status, count]) => ({ status, count }));
}

export async function getOrdersByStatus(status) {
  return fetchAll(endpoints.orders.byStatus(status));
}

export async function getOrdersByDateRange(start, end) {
  return fetchAll(endpoints.orders.byDateRange(start, end));
}

export async function getOrdersByCustomer(customerIdOrEmail) {
  const raw = String(customerIdOrEmail).trim();
  const numeric = Number(raw);

  if (raw !== '' && Number.isFinite(numeric)) {
    return fetchAll(endpoints.orders.byCustomerId(numeric));
  }

  if (raw.includes('@')) {
    const matches = await customerApi.lookup(raw);
    const customer = matches.find(
      (c) => String(c.email_address).toLowerCase() === raw.toLowerCase()
    );
    return customer ? fetchAll(endpoints.orders.byCustomerId(customer.customer_id)) : [];
  }

  return [];
}

export async function createOrder(payload) {
  const { data } = await axios.post(endpoints.orders.create(), payload);
  return data;
}

export async function createOrderItem(payload) {
  const { data } = await axios.post(endpoints.orderItems.create(), payload);
  return data;
}

export async function updateOrder({ id, ...fields }) {
  const { data } = await axios.patch(endpoints.orders.update(id), fields);
  return data;
}

export async function cancelOrder(id) {
  const { data } = await axios.patch(endpoints.orders.update(id), { order_status: 'CANCELLED' });
  return data;
}

export async function deleteOrder(id) {
  const { data } = await axios.delete(endpoints.orders.remove(id));
  return data;
}

export default {
  getAllOrders,
  getOrder,
  getOrdersByStore,
  getOrderStatusCounts,
  getOrdersByStatus,
  getOrdersByDateRange,
  getOrdersByCustomer,
  createOrder,
  createOrderItem,
  updateOrder,
  cancelOrder,
  deleteOrder,
};
