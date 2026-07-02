import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Pencil, X } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import { useUpdateCustomer } from '@features/customers/hooks/useCustomerMutations';
import { Loader } from '@shared/components/common/Loader';
import { getInitials } from '@shared/utils/helpers';
import './ProfileCard.css';

// Kept self-contained on purpose — this is a distinct edit surface from the
// admin Customers feature's create/edit form, not a shared schema.
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const profileSchema = Yup.object({
  fullName: Yup.string().trim().required('This field is required.'),
  email: Yup.string()
    .trim()
    .required('This field is required.')
    .test('is-valid-email', 'Enter a valid email address.', (value) =>
      value ? EMAIL_REGEX.test(value) : true
    ),
});

/**
 * Avatar + name/email card for the signed-in customer, with an inline
 * "Edit" toggle that swaps in a small self-validating form.
 *
 * @param {object} props
 * @param {{id: number, role: string, email: string, fullName: string}} props.user
 */
export function ProfileCard({ user }) {
  const [isEditing, setIsEditing] = useState(false);
  const login = useAuthStore((state) => state.login);
  const updateCustomer = useUpdateCustomer();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullName: user?.fullName ?? '',
      email: user?.email ?? '',
    },
    validationSchema: profileSchema,
    onSubmit: async (values) => {
      const fullName = values.fullName.trim();
      const email = values.email.trim();

      try {
        await updateCustomer.mutateAsync({
          id: user.id,
          full_name: fullName,
          email_address: email,
        });
        login({ ...user, fullName, email });
        setIsEditing(false);
      } catch {
        // Toast already surfaced by the mutation's onError; keep the form
        // open so the customer can retry.
      }
    },
  });

  function handleCancel() {
    formik.resetForm();
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <div className="profile-card">
        <form className="profile-card__form" onSubmit={formik.handleSubmit} noValidate>
          <div className="profile-card__field">
            <label htmlFor="fullName" className="profile-card__label">
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              className="form-control"
              value={formik.values.fullName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.fullName && formik.errors.fullName ? (
              <p className="profile-card__error">{formik.errors.fullName}</p>
            ) : null}
          </div>

          <div className="profile-card__field">
            <label htmlFor="email" className="profile-card__label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="form-control"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email ? (
              <p className="profile-card__error">{formik.errors.email}</p>
            ) : null}
          </div>

          <div className="profile-card__actions">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleCancel}
              disabled={updateCustomer.isPending}
            >
              <X size={16} strokeWidth={1.75} />
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={updateCustomer.isPending}
            >
              {updateCustomer.isPending ? <Loader size="sm" /> : null}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <span className="profile-card__avatar">{getInitials(user?.fullName)}</span>
      <div className="profile-card__info">
        <p className="profile-card__name">{user?.fullName}</p>
        <p className="profile-card__email">{user?.email}</p>
      </div>
      <button
        type="button"
        className="btn btn-outline-secondary profile-card__edit-btn"
        onClick={() => setIsEditing(true)}
      >
        <Pencil size={16} strokeWidth={1.75} />
        Edit
      </button>
    </div>
  );
}

export default ProfileCard;
