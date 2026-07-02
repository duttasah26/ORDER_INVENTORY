import api from '@shared/api/axios';
import { endpoints } from '@shared/api/endpoints';

/**
 * Thin fetch wrappers around the `products` endpoints. Each hook in
 * `hooks/useProducts.js` / `hooks/useProductMutations.js` calls exactly one
 * of these — no response-shaping happens here, only unwrapping `res.data`.
 */
export const productApi = {
  getAll: () => api.get(endpoints.products.all()).then((res) => res.data),

  // Substring match against product_name (server lower-cases + `includes`).
  search: (name) => api.get(endpoints.products.search(name)).then((res) => res.data),

  byBrand: (brand) => api.get(endpoints.products.byBrand(brand)).then((res) => res.data),

  byColour: (colour) => api.get(endpoints.products.byColour(colour)).then((res) => res.data),

  byPriceRange: (min, max) =>
    api.get(endpoints.products.priceRange(min, max)).then((res) => res.data),

  sorted: (field) => api.get(endpoints.products.sort(field)).then((res) => res.data),

  create: (data) => api.post(endpoints.products.create(), data).then((res) => res.data),

  update: (data) => api.put(endpoints.products.update(), data).then((res) => res.data),

  remove: (id) => api.delete(endpoints.products.remove(id)).then((res) => res.data),
};

export default productApi;
