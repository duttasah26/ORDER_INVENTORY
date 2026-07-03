import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@shared/components/common/Loader';
import { useToastStore } from '@stores/toastStore';
import { useRegister } from '../hooks/useAuth';
import { registerSchema } from '../validation/registerSchema';
import './RegisterForm.css';

/**
 * Customer registration form. On success navigates to `/`. On failure
 * (duplicate email is the only mock-auth failure mode) the error is shown
 * inline under the email field, in addition to the global toast.
 */
export function RegisterForm() {
  const navigate = useNavigate();
  const registerMutation = useRegister();
  const addToast = useToastStore((state) => state.addToast);

  const formik = useFormik({
    initialValues: { fullName: '', email: '', password: '' },
    validationSchema: registerSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await registerMutation.mutateAsync(values);
        navigate('/');
      } catch (error) {
        setFieldError('email', error.message);
        addToast({ type: 'error', message: error.message });
      }
    },
  });

  const isPending = formik.isSubmitting || registerMutation.isPending;

  return (
    <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
      <div className="auth-form__field">
        <input
          id="register-fullname"
          name="fullName"
          type="text"
          className="auth-form__input"
          placeholder=" "
          value={formik.values.fullName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isPending}
          autoComplete="name"
        />
        <label htmlFor="register-fullname" className="auth-form__label">
          Full Name
        </label>
        {formik.touched.fullName && formik.errors.fullName ? (
          <p className="auth-form__error">{formik.errors.fullName}</p>
        ) : null}
      </div>

      <div className="auth-form__field">
        <input
          id="register-email"
          name="email"
          type="email"
          className="auth-form__input"
          placeholder=" "
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isPending}
          autoComplete="email"
        />
        <label htmlFor="register-email" className="auth-form__label">
          Email
        </label>
        {formik.touched.email && formik.errors.email ? (
          <p className="auth-form__error">{formik.errors.email}</p>
        ) : null}
      </div>

      <div className="auth-form__field">
        <input
          id="register-password"
          name="password"
          type="password"
          className="auth-form__input"
          placeholder=" "
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isPending}
          autoComplete="new-password"
        />
        <label htmlFor="register-password" className="auth-form__label">
          Password
        </label>
        {formik.touched.password && formik.errors.password ? (
          <p className="auth-form__error">{formik.errors.password}</p>
        ) : null}
      </div>

      <button type="submit" className="btn btn-primary auth-form__submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader size="sm" />
            Creating account…
          </>
        ) : (
          'Create account'
        )}
      </button>
    </form>
  );
}

export default RegisterForm;
