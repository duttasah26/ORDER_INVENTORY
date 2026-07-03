import { useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import { useCartStore } from '@features/cart/store/cartStore';
import { useOnClickOutside } from '@shared/hooks/useOnClickOutside';
import { getInitials, classNames } from '@shared/utils/helpers';
import { ThemeToggle } from '@shared/components/common/ThemeToggle';
import './Navbar.css';

/**
 * Hand-rolled dropdown (no Bootstrap JS) shown when the customer is
 * authenticated. Closes on outside click via useOnClickOutside.
 */
function UserProfileDropdown() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useOnClickOutside(menuRef, () => setIsOpen(false));

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu__trigger"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="Account menu"
      >
        <span className="user-menu__avatar">{getInitials(user?.fullName)}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="user-menu__dropdown" role="menu">
          <Link
            to="/profile"
            className="user-menu__item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            Profile
          </Link>
          <Link
            to="/my-orders"
            className="user-menu__item"
            role="menuitem"
            onClick={() => setIsOpen(false)}
          >
            My Orders
          </Link>
          <button
            type="button"
            className="user-menu__item user-menu__item--danger"
            role="menuitem"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

/** Top nav for CustomerLayout: logo, catalogue link, cart badge, account menu. */
export function Navbar() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const items = useCartStore((state) => state.items);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="navbar">
      <div className="navbar__inner page-container">
        <Link to="/" className="navbar__logo">
          OIMS
        </Link>

        <nav className="navbar__nav" aria-label="Primary navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              classNames('navbar__link', isActive && 'navbar__link--active')
            }
          >
            Shop
          </NavLink>
        </nav>

        <div className="navbar__actions">
          <Link to="/cart" className="navbar__cart" aria-label="View cart">
            <ShoppingCart size={20} aria-hidden="true" />
            {itemCount > 0 && <span className="navbar__cart-badge">{itemCount}</span>}
          </Link>

          <ThemeToggle />

          {isAuthenticated ? (
            <UserProfileDropdown />
          ) : (
            <Link to="/login" className="navbar__signin">
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
