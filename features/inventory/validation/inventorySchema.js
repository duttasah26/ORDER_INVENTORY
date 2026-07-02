import * as Yup from 'yup';

/**
 * Shared by InventoryForm for both the "adjust existing row" (PUT) and
 * "create new inventory record" (POST) flows — both only ever collect a
 * single `quantity` field from the user.
 */
export const inventorySchema = Yup.object({
  quantity: Yup.number()
    .typeError('Quantity must be a number.')
    .required('Quantity is required.')
    .min(0, 'Quantity cannot be negative.'),
});

export default inventorySchema;
