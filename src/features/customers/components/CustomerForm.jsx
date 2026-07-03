import { useFormik } from 'formik';
import { Modal } from '@shared/components/common/Modal';
import { Loader } from '@shared/components/common/Loader';
import { customerSchema } from '../validation/customerSchema';
import { useCustomers } from '../hooks/useCustomers';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomerMutations';
import './CustomerForm.css';

/**
 * Create/edit customer form, rendered inside the shared Modal. On create,
 * checks the already-loaded `useCustomers()` list for a case-insensitive
 * duplicate email before hitting the server, and surfaces it as a
 * field-level error instead.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {{id: number, full_name: string, email_address: string}} [props.customer] - omit for create mode
 */
export function CustomerForm({ isOpen, onClose, customer }) {
  const isEditMode = Boolean(customer);
  const { data: customers } = useCustomers();
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();
  const isPending = createCustomer.isPending || updateCustomer.isPending;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      full_name: customer?.full_name ?? '',
      email_address: customer?.email_address ?? '',
    },
    validationSchema: customerSchema,
    onSubmit: async (values, { setFieldError, resetForm }) => {
      const trimmedName = values.full_name.trim();
      const trimmedEmail = values.email_address.trim();

      if (!isEditMode) {
        const isDuplicate = (customers ?? []).some(
          (existing) => existing.email_address.toLowerCase() === trimmedEmail.toLowerCase()
        );
        if (isDuplicate) {
          setFieldError('email_address', 'A customer with this email already exists.');
          return;
        }
      }

      try {
        if (isEditMode) {
          await updateCustomer.mutateAsync({
            id: customer.id,
            full_name: trimmedName,
            email_address: trimmedEmail,
          });
        } else {
          await createCustomer.mutateAsync({
            full_name: trimmedName,
            email_address: trimmedEmail,
            isblocked: false,
          });
        }
        resetForm();
        onClose();
      } catch {
        // Toast already surfaced by the mutation's onError; keep the form
        // open (with the entered values) so the admin can retry.
      }
    },
  });

  function handleClose() {
    formik.resetForm();
    onClose();
  }

  const footer = (
    <div className="customer-form__actions">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={handleClose}
        disabled={isPending}
      >
        Cancel
      </button>
      <button type="submit" form="customer-form" className="btn btn-primary" disabled={isPending}>
        {isPending ? <Loader size="sm" /> : null}
        {isEditMode ? 'Save Changes' : 'Add Customer'}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditMode ? 'Edit Customer' : 'Add Customer'}
      size="sm"
      footer={footer}
    >
      <form id="customer-form" className="customer-form" onSubmit={formik.handleSubmit} noValidate>
        <div className="customer-form__field">
          <label htmlFor="full_name" className="customer-form__label">
            Full Name
          </label>
          <input
            id="full_name"
            name="full_name"
            type="text"
            className="form-control"
            value={formik.values.full_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.full_name && formik.errors.full_name ? (
            <p className="customer-form__error">{formik.errors.full_name}</p>
          ) : null}
        </div>

        <div className="customer-form__field">
          <label htmlFor="email_address" className="customer-form__label">
            Email Address
          </label>
          <input
            id="email_address"
            name="email_address"
            type="email"
            className="form-control"
            value={formik.values.email_address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email_address && formik.errors.email_address ? (
            <p className="customer-form__error">{formik.errors.email_address}</p>
          ) : null}
        </div>
      </form>
    </Modal>
  );
}

export default CustomerForm;
