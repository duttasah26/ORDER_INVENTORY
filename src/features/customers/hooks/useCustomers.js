import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../api/customerApi';

// Exported so useCustomerMutations.js (and any other feature) can invalidate
// the exact same cache entry `useCustomers()` reads from.
export const CUSTOMERS_QUERY_KEY = ['customers'];

/**
 * Full list of all customer rows. Cross-feature contract: other features
 * (Profile, Orders, …) rely on this exact export to read the in-memory
 * customer list.
 */
export function useCustomers() {
  return useQuery({
    queryKey: CUSTOMERS_QUERY_KEY,
    queryFn: customerApi.getAll,
  });
}

/** `.data` = array of `{ status, count }`. */
export function useShipmentStatusCounts() {
  return useQuery({
    queryKey: ['customers', 'shipment-status-counts'],
    queryFn: customerApi.getShipmentStatusCounts,
  });
}

/**
 * Email (contains '@') or name-substring lookup — the server decides which
 * branch to take, this hook just passes the raw string through.
 */
export function useCustomerSearch(query) {
  return useQuery({
    queryKey: ['customers', 'search', query],
    queryFn: () => customerApi.lookup(query),
    enabled: !!query,
  });
}

/**
 * `.data` shaped `{ customer, orders: [...] }`.
 * Cross-feature: imported by the Profile feature.
 */
export function useCustomerOrders(custId) {
  return useQuery({
    queryKey: ['customers', custId, 'orders'],
    queryFn: () => customerApi.getOrders(custId),
    enabled: !!custId,
  });
}

/** `.data` shaped `{ customer, shipments: [...] }`. */
export function useCustomerShipments(custId) {
  return useQuery({
    queryKey: ['customers', custId, 'shipments'],
    queryFn: () => customerApi.getShipments(custId),
    enabled: !!custId,
  });
}

// --- Remaining endpoints, wrapped for completeness ---------------------

export function useCustomersPendingShipments() {
  return useQuery({
    queryKey: ['customers', 'pending-shipments'],
    queryFn: customerApi.getPendingShipments,
  });
}

export function useCustomersCompletedOrders() {
  return useQuery({
    queryKey: ['customers', 'completed-orders'],
    queryFn: customerApi.getCompletedOrders,
  });
}

export function useCustomersByOrderQuantityRange(min, max) {
  return useQuery({
    queryKey: ['customers', 'order-quantity-range', min, max],
    queryFn: () => customerApi.getByOrderQuantityRange(min, max),
    enabled: min !== undefined && min !== null && max !== undefined && max !== null,
  });
}

export function useCustomersOverdueShipments() {
  return useQuery({
    queryKey: ['customers', 'overdue-shipments'],
    queryFn: customerApi.getOverdueShipments,
  });
}

export default useCustomers;
