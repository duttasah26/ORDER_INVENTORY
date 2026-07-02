import api from '@shared/api/axios';
import { endpoints } from '@shared/api/endpoints';

/**
 * Thin fetch wrappers around the `stores` endpoints. Stores are read-only in
 * this build — there is no create/update/remove here, only the two plain
 * passthrough routes the mock server exposes.
 */
export const storeApi = {
  // Array of all 23 store rows: {id, store_id, store_name, web_address,
  // physical_address, latitude, longitude, logo, logo_mime_type,
  // logo_filename, logo_charset, logo_last_updated}.
  getAll: () => api.get(endpoints.stores.all()).then((res) => res.data),

  // Single store row, matched by `id`.
  getById: (id) => api.get(endpoints.stores.byId(id)).then((res) => res.data),
};

export default storeApi;
