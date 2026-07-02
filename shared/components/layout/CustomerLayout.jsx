import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import './CustomerLayout.css';

/** Customer shell: Navbar (top) + animated per-route content + Footer. */
export function CustomerLayout() {
  const location = useLocation();

  return (
    <div className="customer-layout">
      <Navbar />

      <main className="customer-layout__content">
        <div key={location.pathname} className="page-container fade-slide-up-enter">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default CustomerLayout;
