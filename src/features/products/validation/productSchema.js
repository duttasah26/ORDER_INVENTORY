import * as Yup from 'yup';

export const productSchema = Yup.object({
  product_name: Yup.string().trim().required('This field is required.'),
  unit_price: Yup.number()
    .typeError('This field is required.')
    .required('This field is required.')
    .moreThan(0, 'Price must be greater than 0.'),
  colour: Yup.string().trim().required('This field is required.'),
  brand: Yup.string().trim().required('This field is required.'),
  size: Yup.string().trim().required('This field is required.'),
  rating: Yup.number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Rating must be a number between 0 and 5.')
    .min(0, 'Rating must be a number between 0 and 5.')
    .max(5, 'Rating must be a number between 0 and 5.')
    .optional(),
});

export default productSchema;
