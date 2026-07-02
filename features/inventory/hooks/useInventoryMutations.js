import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToastStore } from '@stores/toastStore';
import { inventoryApi } from '../api/inventoryApi';
import { INVENTORY_QUERY_KEY } from './useInventory';

/**
 * PUT — body `{id, product_inventory}`. Backs the restock modal's "adjust
 * an existing row" flow. Documented placeholder endpoint on the server;
 * treated here as a normal update with no extra validation beyond `id`
 * being present (enforced by `inventorySchema` / the caller supplying it).
 */
export function useUpdateInventory() {
  const queryClient = useQueryClient();
  const addToast = useToastStore((state) => state.addToast);

  return useMutation({
    mutationFn: (data) => inventoryApi.update(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INVENTORY_QUERY_KEY });
      addToast({ type: 'success', message: 'Inventory updated.' });
    },
    onError: () => {
      addToast({ type: 'error', message: "Couldn't save inventory. Please try again." });
    },
  });
}

export default useUpdateInventory;
