import { useQuery } from '@tanstack/react-query';
import { getShipments, getShipmentById } from '../api/shipmentApi';

/**
 * Full shipments list. There's no dedicated "list vs detail" shape
 * difference on the server for this collection, so this is a plain fetch.
 */
export function useShipments() {
  return useQuery({
    queryKey: ['shipments'],
    queryFn: getShipments,
  });
}

/**
 * Single shipment by id. Always does a live per-id fetch against
 * GET /shipments/:id rather than deriving from the cached list — simplest
 * correct implementation given there's no shape difference to exploit.
 */
export function useShipment(id) {
  return useQuery({
    queryKey: ['shipments', id],
    queryFn: () => getShipmentById(id),
    enabled: id !== undefined && id !== null,
  });
}

export default useShipments;
