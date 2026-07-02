import api from '@shared/api/axios';
import endpoints from '@shared/api/endpoints';

/**
 * Read-only passthrough for the shipments collection. `Endpoints.csv`
 * documents no dedicated shipments CRUD endpoints — the mock server only
 * exposes plain GET routes for this collection (see
 * `server/routes/shipments.js`), so there is nothing to write here.
 */

export function getShipments() {
  return api.get(endpoints.shipments.all()).then((response) => response.data);
}

export function getShipmentById(id) {
  return api.get(endpoints.shipments.byId(id)).then((response) => response.data);
}

export default { getShipments, getShipmentById };
