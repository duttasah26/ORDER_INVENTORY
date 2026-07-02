import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api/productApi';

// Exported so useProductMutations.js (and any other feature) can invalidate
// the exact same cache entry `useProducts()` reads from.
export const PRODUCTS_QUERY_KEY = ['products'];

/**
 * Full list of all product rows. Cross-feature contract: other features
 * (cart, inventory, orders, dashboard, …) rely on this exact export to read
 * the in-memory product list. Since the dataset is tiny (61 rows), this is
 * the primary data source for all product UI — prefer client-side
 * filter/sort/search via `useMemo` against this instead of round-tripping
 * to the dedicated endpoints below per keystroke.
 */
export function useProducts() {
  return useQuery({
    queryKey: PRODUCTS_QUERY_KEY,
    queryFn: productApi.getAll,
  });
}

/** Substring match against `product_name`. `.data` = array of matches. */
export function useProductSearch(name) {
  return useQuery({
    queryKey: ['products', 'search', name],
    queryFn: () => productApi.search(name),
    enabled: !!name,
  });
}

/** `.data` = array of products for an exact (case-insensitive) brand match. */
export function useProductsByBrand(brand) {
  return useQuery({
    queryKey: ['products', 'brand', brand],
    queryFn: () => productApi.byBrand(brand),
    enabled: !!brand,
  });
}

/** `.data` = array of products for an exact (case-insensitive) colour match. */
export function useProductsByColour(colour) {
  return useQuery({
    queryKey: ['products', 'colour', colour],
    queryFn: () => productApi.byColour(colour),
    enabled: !!colour,
  });
}

/** `.data` = array of products with `unit_price` between `min` and `max` inclusive. */
export function useProductsByPriceRange(min, max) {
  return useQuery({
    queryKey: ['products', 'price-range', min, max],
    queryFn: () => productApi.byPriceRange(min, max),
    enabled: Number.isFinite(min) && Number.isFinite(max),
  });
}

/** `.data` = full product array sorted by `field` ('unit_price'|'product_name'|'rating'). */
export function useProductsSorted(field) {
  return useQuery({
    queryKey: ['products', 'sort', field],
    queryFn: () => productApi.sorted(field),
    enabled: !!field,
  });
}

export default useProducts;
