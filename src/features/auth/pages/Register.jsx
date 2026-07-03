import { Link } from 'react-router-dom';
import AuthCard from '../components/AuthCard';
import RegisterForm from '../components/RegisterForm';

export function Register() {
  return (
    <AuthCard title="Create your account" subtitle="Register to start shopping.">
      <RegisterForm />

      <div className="auth-card__links">
        <p className="auth-card__link-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-card__link">
            Sign in
          </Link>
        </p>
      </div>
    </AuthCard>
  );
}

export default Register;
