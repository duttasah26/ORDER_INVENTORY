import { Link, Outlet } from 'react-router-dom';
import Footer from './Footer';
import './PublicLayout.css';

/**
 * Minimal shell for /login, /admin/login, /register: logo + centered
 * outlet + footer. Subtle radial accent glow is the only decorative
 * color use in this wrapper (applied via ::before in PublicLayout.css).
 */
export function PublicLayout() {
  return (
    <div className="public-layout">
      <header className="public-layout__header">
        <Link to="/" className="public-layout__logo">
          OIMS
        </Link>
      </header>

      <main className="public-layout__content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default PublicLayout;
