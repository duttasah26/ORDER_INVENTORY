import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Loader } from '@shared/components/common/Loader';
import { useToastStore } from '@stores/toastStore';
import { useLogin } from '../hooks/useAuth';
import { loginSchema } from '../validation/loginSchema';
import './LoginForm.css';

/**
 * Customer sign-in form. On success navigates to `/`. On failure the mock
 * auth hook's error is shown inline near the password field (per the design
 * doc's "inline field error" pattern for login failure), in addition to the
 * global toast.
 */
export function LoginForm() {
  const navigate = useNavigate();
  const loginMutation = useLogin();
  const addToast = useToastStore((state) => state.addToast);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginSchema,
    onSubmit: async (values, { setFieldError }) => {
      try {
        await loginMutation.mutateAsync(values);
        navigate('/');
      } catch (error) {
        setFieldError('password', error.message);
        addToast({ type: 'error', message: error.message });
      }
    },
  });

  const isPending = formik.isSubmitting || loginMutation.isPending;

  return (
    <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
      <div className="auth-form__field">
        <input
          id="login-email"
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
        <label htmlFor="login-email" className="auth-form__label">
          Email
        </label>
        {formik.touched.email && formik.errors.email ? (
          <p className="auth-form__error">{formik.errors.email}</p>
        ) : null}
      </div>

      <div className="auth-form__field">
        <input
          id="login-password"
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
        <label htmlFor="login-password" className="auth-form__label">
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

export default LoginForm;
