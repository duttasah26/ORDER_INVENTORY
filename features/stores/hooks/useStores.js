import { useQuery } from '@tanstack/react-query';
import { storeApi } from '../api/storeApi';

// Exported so other features can invalidate/reuse the exact cache entry
// `useStores()` reads from.
export const STORES_QUERY_KEY = ['stores'];

/**
 * Full list of all 23 store rows.
 *
 * Cross-feature contract: `.data` = the full store array, straight from
 * GET /stores. Other features (Inventory, Orders, Dashboard, …) import this
 * exact hook from this exact file — don't change the export name or shape.
 */
export function useStores() {
  return useQuery({
    queryKey: STORES_QUERY_KEY,
    queryFn: storeApi.getAll,
  });
}

/**
 * Single store by `id`. Looks it up inside the already-cached `useStores()`
 * list first (no extra request in the common case where the list has
 * already loaded). Falls back to a direct `GET /stores/:id` query when the
 * row isn't in the cached list yet — e.g. a deep link straight to
 * `/admin/stores/:id` before the list has ever been fetched.
 *
 * `.data` = a single store row, or `undefined` while loading / not found.
 */
export function useStore(id) {
  const storesQuery = useStores();
  const cached = storesQuery.data?.find((store) => String(store.id) === String(id));

  const fallbackQuery = useQuery({
    queryKey: [...STORES_QUERY_KEY, 'detail', id],
    queryFn: () => storeApi.getById(id),
    enabled: Boolean(id) && !cached,
  });

  if (cached) {
    return {
      ...storesQuery,
      data: cached,
    };
  }

  return fallbackQuery;
}

export default useStores;
