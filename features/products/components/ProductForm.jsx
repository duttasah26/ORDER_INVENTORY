import { useFormik } from 'formik';
import { Modal } from '@shared/components/common/Modal';
import { Loader } from '@shared/components/common/Loader';
import { productSchema } from '../validation/productSchema';
import './ProductForm.css';

/**
 * Create/edit product form, rendered inside the shared Modal. Purely
 * presentational + validation — the caller supplies `onSubmit` and is
 * responsible for actually calling the create/update mutation.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {object} [props.initialValues] - a product object for edit mode, omit for create
 * @param {(values: object) => Promise<void>|void} props.onSubmit
 */
export function ProductForm({ isOpen, onClose, initialValues, onSubmit }) {
  const isEditMode = Boolean(initialValues);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      product_name: initialValues?.product_name ?? '',
      unit_price: initialValues?.unit_price ?? '',
      colour: initialValues?.colour ?? '',
      brand: initialValues?.brand ?? '',
      size: initialValues?.size ?? '',
      rating: initialValues?.rating ?? '',
    },
    validationSchema: productSchema,
    onSubmit: async (values) => {
      const payload = {
        product_name: values.product_name.trim(),
        unit_price: Number(values.unit_price),
        colour: values.colour.trim(),
        brand: values.brand.trim(),
        size: values.size.trim(),
        ...(values.rating === '' || values.rating === null || values.rating === undefined
          ? {}
          : { rating: Number(values.rating) }),
      };

      try {
        await onSubmit(payload);
        formik.resetForm();
        onClose();
      } catch {
        // Toast already surfaced by the caller's mutation onError; keep the
        // form open (with the entered values) so the user can retry.
      }
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  const footer = (
    <div className="product-form__actions">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleClose}
        disabled={formik.isSubmitting}
      >
        Cancel
      </button>
      <button type="submit" form="product-form" className="btn btn-primary" disabled={formik.isSubmitting}>
        {formik.isSubmitting ? <Loader size="sm" /> : null}
        Save
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Product' : 'Add Product'}
      size="sm"
      footer={footer}
    >
      <form id="product-form" className="product-form" onSubmit={formik.handleSubmit} noValidate>
        <div className="product-form__field">
          <label htmlFor="product_name" className="product-form__label">
            Product Name
          </label>
          <input
            id="product_name"
            name="product_name"
            type="text"
            className="form-control"
            value={formik.values.product_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.product_name && formik.errors.product_name ? (
            <p className="product-form__error">{formik.errors.product_name}</p>
          ) : null}
        </div>

        <div className="product-form__field">
          <label htmlFor="unit_price" className="product-form__label">
            Unit Price
          </label>
          <input
            id="unit_price"
            name="unit_price"
            type="number"
            step="0.01"
            min="0"
            className="form-control"
            value={formik.values.unit_price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.unit_price && formik.errors.unit_price ? (
            <p className="product-form__error">{formik.errors.unit_price}</p>
          ) : null}
        </div>

        <div className="product-form__row">
          <div className="product-form__field">
            <label htmlFor="colour" className="product-form__label">
              Colour
            </label>
            <input
              id="colour"
              name="colour"
              type="text"
              className="form-control"
              value={formik.values.colour}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.colour && formik.errors.colour ? (
              <p className="product-form__error">{formik.errors.colour}</p>
            ) : null}
          </div>

          <div className="product-form__field">
            <label htmlFor="size" className="product-form__label">
              Size
            </label>
            <input
              id="size"
              name="size"
              type="text"
              className="form-control"
              value={formik.values.size}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.size && formik.errors.size ? (
              <p className="product-form__error">{formik.errors.size}</p>
            ) : null}
          </div>
        </div>

        <div className="product-form__row">
          <div className="product-form__field">
            <label htmlFor="brand" className="product-form__label">
              Brand
            </label>
            <input
              id="brand"
              name="brand"
              type="text"
              className="form-control"
              value={formik.values.brand}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.brand && formik.errors.brand ? (
              <p className="product-form__error">{formik.errors.brand}</p>
            ) : null}
          </div>

          <div className="product-form__field">
            <label htmlFor="rating" className="product-form__label">
              Rating (optional)
            </label>
            <input
              id="rating"
              name="rating"
              type="number"
              step="0.5"
              min="0"
              max="5"
              className="form-control"
              value={formik.values.rating}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.rating && formik.errors.rating ? (
              <p className="product-form__error">{formik.errors.rating}</p>
            ) : null}
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default ProductForm;
