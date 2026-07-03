import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import LoginForm from '../components/LoginForm';

export function Login() {
  return (
    <AuthCard title="Sign in to Order Inventory" subtitle="Enter your credentials to continue.">
      <LoginForm />

      <div className="auth-card__links">
        <p className="auth-card__link-text">
          Don&rsquo;t have an account?{' '}
          <Link to="/register" className="auth-card__link">
            Register
          </Link>
        </p>
        <p className="auth-card__link-text">
          Admin?{' '}
          <Link to="/admin/login" className="auth-card__link">
            Sign in here
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default Login;
