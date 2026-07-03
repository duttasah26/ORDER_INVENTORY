import { useMutation } from '@tanstack/react-query';

/**
 * Placeholder mutation only. `Endpoints.csv` documents no write endpoint for
 * shipments at all — `shipmentApi.js` exposes just `getShipments` and
 * `getShipmentById` — so there is nothing real to call here yet. This hook exists so the shape is ready for
 * when a real "update shipment status" endpoint ships, but it intentionally
 * always rejects rather than silently pretending to succeed.
 *
 * Do NOT wire this to a visible/enabled UI control until a real backend
 * endpoint exists; the shipments UI is deliberately read-only for now.
 */
export function useUpdateShipmentStatus() {
  return useMutation({
    mutationFn: () =>
      Promise.reject(
        new Error('Updating shipment status is not yet supported by the backend.')
      ),
  });
}

export default useUpdateShipmentStatus;
