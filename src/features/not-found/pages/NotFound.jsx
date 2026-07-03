import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import './NotFound.css';

/**
 * Catch-all `*` route. Rendered standalone (no layout wrapper) so it must
 * supply its own full-page centering.
 */
export function NotFound() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="not-found-page">
      <p className="not-found-page__watermark" aria-hidden="true">404</p>
      <Compass className="not-found-page__icon" size={96} strokeWidth={1.25} aria-hidden="true" />
      <h1 className="not-found-page__heading">Page not found</h1>
      <p className="not-found-page__body">
        The page you're looking for doesn't exist or has moved.
      </p>
      <Link to={isAdmin ? '/admin' : '/'} className="btn btn-primary not-found-page__action">
        {isAdmin ? 'Back to Dashboard' : 'Back to Home'}
      </Link>
    </div>
  );
}

export default NotFound;
