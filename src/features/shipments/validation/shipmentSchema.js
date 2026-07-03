import * as yup from 'yup';

/**
 * Not currently wired to any form — the shipments UI is read-only because
 * there is no real backend endpoint to update a shipment (see
 * `useShipmentMutations.js`). Kept here so the validation shape is ready
 * for whenever a real "update shipment status" endpoint ships.
 */
export const shipmentStatusSchema = yup.object({
  shipment_status: yup
    .string()
    .oneOf(['CREATED', 'SHIPPED', 'DELIVERED'], 'Invalid shipment status.')
    .required('Shipment status is required.'),
});

export default shipmentStatusSchema;
