import api from '@shared/api/axios';
import { endpoints } from '@shared/api/endpoints';

/**
 * Thin fetch wrappers around the `customers` endpoints. Each hook in
 * `hooks/useCustomers.js` / `hooks/useCustomerMutations.js` calls exactly one
 * of these — no response-shaping happens here, only unwrapping `res.data`.
 */
export const customerApi = {
  getAll: () => api.get(endpoints.customers.all()).then((res) => res.data),

  getShipmentStatusCounts: () =>
    api.get(endpoints.customers.shipmentStatusCounts()).then((res) => res.data),

  getPendingShipments: () =>
    api.get(endpoints.customers.pendingShipments()).then((res) => res.data),

  getOverdueShipments: () =>
    api.get(endpoints.customers.overdueShipments()).then((res) => res.data),

  getCompletedOrders: () =>
    api.get(endpoints.customers.completedOrders()).then((res) => res.data),

  getByOrderQuantityRange: (min, max) =>
    api.get(endpoints.customers.byOrderQuantityRange(min, max)).then((res) => res.data),

  // { customer, orders: [...] }
  getOrders: (custId) =>
    api.get(endpoints.customers.orders(custId)).then((res) => res.data),

  // { customer, shipments: [...] }
  getShipments: (custId) =>
    api.get(endpoints.customers.shipments(custId)).then((res) => res.data),

  // Server branches on '@' -> email lookup, else name substring. Returns an array.
  lookup: (emailOrName) =>
    api.get(endpoints.customers.lookup(emailOrName)).then((res) => res.data),

  create: (data) => api.post(endpoints.customers.create(), data).then((res) => res.data),

  update: (data) => api.put(endpoints.customers.update(), data).then((res) => res.data),

  remove: (customerId) =>
    api.delete(endpoints.customers.remove(customerId)).then((res) => res.data),
};

export default customerApi;
