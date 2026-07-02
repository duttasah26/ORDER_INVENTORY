import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../api/inventoryApi';

// Exported so useInventoryMutations.js (and any other feature) can
// invalidate the exact same cache entries these hooks read from.
export const INVENTORY_QUERY_KEY = ['inventory'];

/**
 * Full (optionally store-filtered) inventory list.
 *
 * Cross-feature contract: `.data` = array of inventory rows
 * `{id, inventory_id, store_id, product_id, product_inventory, product, store}`.
 * This exact param/return shape is load-bearing for other features
 * (Dashboard, Stores) — don't change it.
 *
 * @param {number|string} [storeId] - pass `undefined` for the unfiltered "all" case
 */
export function useInventory(storeId) {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, 'list', storeId ?? 'all'],
    queryFn: () => inventoryApi.getAll(storeId),
  });
}

/** `.data` = array of inventory rows for a specific product+store pair. */
export function useInventoryByProductStore(productId, storeId) {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, 'byProductStore', productId, storeId],
    queryFn: () => inventoryApi.getByProductStore(productId, storeId),
    enabled: !!productId && !!storeId,
  });
}

/**
 * `.data` = array of inventory rows whose product matches `category`.
 * NOTE: the server matches `category` against product `brand` — this
 * schema has no literal "category" field on products.
 */
export function useInventoryByCategory(category) {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, 'byCategory', category],
    queryFn: () => inventoryApi.getByCategory(category),
    enabled: !!category,
  });
}

/** `.data` = `{records, byShipmentStatus}`. */
export function useInventoryShipmentReport() {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, 'shipmentReport'],
    queryFn: () => inventoryApi.getShipmentReport(),
  });
}

/**
 * `.data` = `{store, customer, products}`.
 * Cross-feature: imported by the Orders feature.
 */
export function useInventoryByOrder(orderId) {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, 'byOrder', orderId],
    queryFn: () => inventoryApi.getByOrder(orderId),
    enabled: !!orderId,
  });
}

/**
 * `.data` = array of `{product, quantity, unitPrice, lineTotal, shipmentStatus, store, orderStatus}`.
 * Cross-feature: imported by the Orders and Dashboard features — this
 * exact shape is load-bearing.
 */
export function useInventoryOrderDetails(orderId) {
  return useQuery({
    queryKey: [...INVENTORY_QUERY_KEY, 'orderDetails', orderId],
    queryFn: () => inventoryApi.getOrderDetails(orderId),
    enabled: !!orderId,
  });
}

export default useInventory;
