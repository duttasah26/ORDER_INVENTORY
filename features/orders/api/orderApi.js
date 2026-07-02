import axios from '@shared/api/axios';
import endpoints from '@shared/api/endpoints';

/**
 * Thin wrapper around the `orders` REST surface. Hooks in
 * `features/orders/hooks/*` are the only intended callers - components
 * should go through those, not this module directly.
 */

export async function getAllOrders() {
  const { data } = await axios.get(endpoints.orders.all());
  return data;
}

// Numeric `idOrStore` -> joined order detail `{...order, customer, store, items}`.
export async function getOrder(id) {
  const { data } = await axios.get(endpoints.orders.byIdOrStore(id));
  return data;
}

// Non-numeric `idOrStore` -> array of `{orderid, orderstatus, storename, webaddress}`.
export async function getOrdersByStore(storeName) {
  const { data } = await axios.get(endpoints.orders.byIdOrStore(storeName));
  return data;
}

export async function getOrderStatusCounts() {
  const { data } = await axios.get(endpoints.orders.statusCounts());
  return data;
}

export async function getOrdersByStatus(status) {
  const { data } = await axios.get(endpoints.orders.byStatus(status));
  return data;
}

export async function getOrdersByDateRange(start, end) {
  const { data } = await axios.get(endpoints.orders.byDateRange(start, end));
  return data;
}

export async function getOrdersByCustomer(customerIdOrEmail) {
  const { data } = await axios.get(endpoints.orders.byCustomer(customerIdOrEmail));
  return data;
}

export async function createOrder(payload) {
  const { data } = await axios.post(endpoints.orders.create(), payload);
  return data;
}

// No dedicated endpoint builder exists for `order_items` (plain default CRUD
// on the mock server), so the path is hit literally here.
export async function createOrderItem(payload) {
  const { data } = await axios.post('/order_items', payload);
  return data;
}

export async function updateOrder(payload) {
  const { data } = await axios.put(endpoints.orders.update(), payload);
  return data;
}

// Documented quirk: cancellation is a GET on the mock server.
export async function cancelOrder(id) {
  const { data } = await axios.get(endpoints.orders.cancel(id));
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
