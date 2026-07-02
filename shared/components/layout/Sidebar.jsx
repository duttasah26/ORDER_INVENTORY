import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Warehouse,
  Building2,
  Truck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useUIStore } from '@stores/uiStore';
import { classNames } from '@shared/utils/helpers';
import './Sidebar.css';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin', end: true },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Inventory', icon: Warehouse, path: '/admin/inventory' },
  { label: 'Stores', icon: Building2, path: '/admin/stores' },
  { label: 'Shipments', icon: Truck, path: '/admin/shipments' },
];

/**
 * Left navigation for AdminLayout. Collapsible width driven by useUIStore;
 * active route gets a growing accent left-border + tinted background.
 */
export function Sidebar() {
  const isCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <aside className={classNames('sidebar', isCollapsed && 'sidebar--collapsed')}>
      <nav className="sidebar__nav" aria-label="Admin navigation">
        <ul className="sidebar__list">
          {NAV_ITEMS.map(({ label, icon: Icon, path, end }) => (
            <li key={path} className="sidebar__item">
              <NavLink
                to={path}
                end={end}
                title={isCollapsed ? label : undefined}
                className={({ isActive }) =>
                  classNames('sidebar__link', isActive && 'sidebar__link--active')
                }
              >
                <span className="sidebar__icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="sidebar__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="sidebar__toggle"
        onClick={toggleSidebar}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight size={18} aria-hidden="true" />
        ) : (
          <ChevronLeft size={18} aria-hidden="true" />
        )}
      </button>
    </aside>
  );
}

export default Sidebar;
