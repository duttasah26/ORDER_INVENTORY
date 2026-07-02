import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@shared/components/common/Loader';
import { useToastStore } from '@stores/toastStore';
import { useAdminLogin } from '../hooks/useAuth';
import { loginSchema } from '../validation/loginSchema';
import './AdminLoginForm.css';

/**
 * Admin sign-in form. Same shape as LoginForm but authenticates against the
 * `admin` collection and navigates to `/admin` on success.
 */
export function AdminLoginForm() {
  const navigate = useNavigate();
  const adminLoginMutation = useAdminLogin();
  const addToast = useToastStore((state) => state.addToast);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await adminLoginMutation.mutateAsync(values);
        navigate('/admin');
      } catch (error) {
        setFieldError('password', error.message);
        addToast({ type: 'error', message: error.message });
      }
    },
  });

  const isPending = formik.isSubmitting || adminLoginMutation.isPending;

  return (
    <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
      <div className="auth-form__field">
        <input
          id="admin-login-email"
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
        <label htmlFor="admin-login-email" className="auth-form__label">
          Email
        </label>
        {formik.touched.email && formik.errors.email ? (
          <p className="auth-form__error">{formik.errors.email}</p>
        ) : null}
      </div>

      <div className="auth-form__field">
        <input
          id="admin-login-password"
          name="password"
          type="password"
          className="auth-form__input"
          placeholder=" "
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={isPending}
          autoComplete="current-password"
        />
        <label htmlFor="admin-login-password" className="auth-form__label">
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
            Signing in…
          </>
        ) : (
          'Sign in'
        )}
      </button>
    </form>
  );
}

export default AdminLoginForm;
