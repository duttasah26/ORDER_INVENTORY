import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import AdminLoginForm from '../components/AdminLoginForm';

export function AdminLogin() {
  return (
    <AuthCard title="Admin sign in" subtitle="Enter your admin credentials to continue.">
      <AdminLoginForm />

      <div className="auth-card__links">
        <p className="auth-card__link-text">
          Not an admin?{' '}
          <Link to="/login" className="auth-card__link">
            Sign in as a customer
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default AdminLogin;
