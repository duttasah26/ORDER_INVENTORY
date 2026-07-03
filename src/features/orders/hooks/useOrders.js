import { useQuery } from '@tanstack/react-query';
import * as orderApi from '../api/orderApi';

/**
 * Fixed cross-feature contract - the Stores/Dashboard/Cart features import
 * these hooks directly from this file. Do not rename the exports or change
 * their `.data` shapes.
 */

// Full array of every order row. `.data` = Array<{id, order_id, order_tms,
// customer_id, order_status, store_id}>.
export function useOrders() {
  return useQuery({
    queryKey: ['orders', 'list'],
    queryFn: orderApi.getAllOrders,
  });
}

// Joined order detail: `.data` = `{...order, customer, store, items: [...]}`.
export function useOrder(id) {
  return useQuery({
    queryKey: ['orders', 'detail', id],
    queryFn: () => orderApi.getOrder(id),
    enabled: Boolean(id),
  });
}

// Store-name lookup branch of the same endpoint. `.data` = Array<{orderid,
// orderstatus, storename, webaddress}>. Imported by the Stores feature.
export function useOrdersByStore(storeName) {
  return useQuery({
    queryKey: ['orders', 'by-store', storeName],
    queryFn: () => orderApi.getOrdersByStore(storeName),
    enabled: Boolean(storeName),
  });
}

// `.data` = Array<{status, count}>.
export function useOrderStatusCounts() {
  return useQuery({
    queryKey: ['orders', 'status-counts'],
    queryFn: orderApi.getOrderStatusCounts,
  });
}

export function useOrdersByStatus(status) {
  return useQuery({
    queryKey: ['orders', 'by-status', status],
    queryFn: () => orderApi.getOrdersByStatus(status),
    enabled: Boolean(status),
  });
}

export function useOrdersByDateRange(start, end) {
  return useQuery({
    queryKey: ['orders', 'by-date-range', start, end],
    queryFn: () => orderApi.getOrdersByDateRange(start, end),
    enabled: Boolean(start && end),
  });
}

export function useOrdersByCustomer(customerIdOrEmail) {
  return useQuery({
    queryKey: ['orders', 'by-customer', customerIdOrEmail],
    queryFn: () => orderApi.getOrdersByCustomer(customerIdOrEmail),
    enabled: Boolean(customerIdOrEmail),
  });
}

export default useOrders;
