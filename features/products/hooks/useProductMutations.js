import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@stores/toastStore';
import { productApi } from '../api/productApi';
import { PRODUCTS_QUERY_KEY } from './useProducts';

const SAVE_ERROR_MESSAGE = "Couldn't save product. Please try again.";

/** POST — create a new product. */
export function useCreateProduct() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => productApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      addToast({ type: 'success', message: 'Product added.' });
    },
    onError: () => {
      addToast({ type: 'error', message: SAVE_ERROR_MESSAGE });
    },
  });
}

/** PUT — body `{id, ...fields}`. */
export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => productApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      addToast({ type: 'success', message: 'Product updated.' });
    },
    onError: () => {
      addToast({ type: 'error', message: SAVE_ERROR_MESSAGE });
    },
  });
}

/** DELETE by product id. */
export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (id) => productApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCTS_QUERY_KEY });
      addToast({ type: 'success', message: 'Product deleted.' });
    },
    onError: () => {
      addToast({ type: 'error', message: "Couldn't delete product. Please try again." });
    },
  });
}
