import api from '@shared/api/axios';
import { endpoints } from '@shared/api/endpoints';

/**
 * Thin fetch wrappers around the `inventory` endpoints. Each hook in
 * `hooks/useInventory.js` / `hooks/useInventoryMutations.js` calls exactly
 * one of these — no response-shaping happens here, only unwrapping
 * `res.data`.
 */
export const inventoryApi = {
  // Pass `storeId` as `undefined` for the unfiltered "all stores" case —
  // `endpoints.inventory.all` only appends `?storeid=` when it's truthy.
  // Unfiltered rows come back pre-joined as `{...row, product, store}`;
  // store-filtered rows come back as raw `{id, inventory_id, store_id,
  // product_id, product_inventory}` (server-side behavior, not a bug here).
  getAll: (storeId) => api.get(endpoints.inventory.all(storeId)).then((res) => res.data),

  getByProductStore: (productId, storeId) =>
    api.get(endpoints.inventory.byProductStore(productId, storeId)).then((res) => res.data),

  // `category` is matched server-side against the product `brand` field —
  // this schema has no real "category" field on products.
  getByCategory: (category) =>
    api.get(endpoints.inventory.byCategory(category)).then((res) => res.data),

  // { records, byShipmentStatus }
  getShipmentReport: () => api.get(endpoints.inventory.shipmentReport()).then((res) => res.data),

  // { store, customer, products }
  getByOrder: (orderId) => api.get(endpoints.inventory.byOrder(orderId)).then((res) => res.data),

  // Array of { product, quantity, unitPrice, lineTotal, shipmentStatus, store, orderStatus }
  getOrderDetails: (orderId) =>
    api.get(endpoints.inventory.orderDetails(orderId)).then((res) => res.data),

  // Documented placeholder endpoint backing the restock flow — a normal
  // update, no special validation beyond the server requiring a valid `id`.
  update: ({ id, product_inventory }) =>
    api.put(endpoints.inventory.update(), { id, product_inventory }).then((res) => res.data),

  // No dedicated "create inventory record" endpoint exists — the default
  // json-server router underneath handles a plain POST to the `inventory`
  // collection, so we hit it directly via the shared axios instance.
  create: ({ store_id, product_id, product_inventory }) =>
    api.post('/inventory', { store_id, product_id, product_inventory }).then((res) => res.data),
};

export default inventoryApi;
