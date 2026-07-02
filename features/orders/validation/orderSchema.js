import * as yup from 'yup';

// One line item in the admin "quick create order" flow (see Orders.jsx),
// mirroring the shape stored in `stores/orderDraftStore.js`.
export const orderLineSchema = yup.object({
  productId: yup.number().typeError('Pick a product.').required('Pick a product.'),
  unitPrice: yup
    .number()
    .typeError('Unit price is invalid.')
    .min(0, 'Unit price must be zero or more.')
    .required(),
  quantity: yup
    .number()
    .typeError('Quantity must be a number.')
    .integer('Quantity must be a whole number.')
    .min(1, 'Quantity must be at least 1.')
    .required(),
});

// Validates the full new-order draft before submission.
export const orderSchema = yup.object({
  customerId: yup
    .number()
    .typeError('Select a customer.')
    .required('Select a customer.'),
  storeId: yup.number().typeError('Select a store.').required('Select a store.'),
  lines: yup
    .array()
    .of(orderLineSchema)
    .min(1, 'Add at least one product line.')
    .required(),
});

export default orderSchema;
