import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@stores/toastStore';
import { customerApi } from '../api/customerApi';
import { CUSTOMERS_QUERY_KEY } from './useCustomers';

const SAVE_ERROR_MESSAGE = "Couldn't save customer. Please try again.";

/**
 * POST — create a new customer.
 * Cross-feature: used by admin Customers page.
 */
export function useCreateCustomer() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => customerApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      addToast({ type: 'success', message: 'Customer added.' });
    },
    onError: () => {
      addToast({ type: 'error', message: SAVE_ERROR_MESSAGE });
    },
  });
}

/**
 * PATCH by id — body `{...fields}`. Also how ban/unban works: callers just pass
 * `{id, isblocked: true|false}` — there is no separate ban endpoint.
 * Cross-feature: imported by the Profile feature for self-service edits.
 */
export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => customerApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      addToast({ type: 'success', message: 'Customer updated.' });
    },
    onError: () => {
      addToast({ type: 'error', message: SAVE_ERROR_MESSAGE });
    },
  });
}

/** DELETE by customer id. */
export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (customerId) => customerApi.remove(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMERS_QUERY_KEY });
      addToast({ type: 'success', message: 'Customer deleted.' });
    },
    onError: () => {
      addToast({ type: 'error', message: "Couldn't delete customer. Please try again." });
    },
  });
}
