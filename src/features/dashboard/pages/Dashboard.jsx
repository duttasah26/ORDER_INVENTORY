import { ShoppingCart, Users, Package, TriangleAlert } from 'lucide-react';
import { useOrders } from '@features/orders/hooks/useOrders';
import { useCustomers } from '@features/customers/hooks/useCustomers';
import { useInventory } from '@features/inventory/hooks/useInventory';
import { Skeleton } from '@shared/components/common/Skeleton';
import { ErrorState } from '@shared/components/common/ErrorState';
import { LOW_STOCK_THRESHOLD } from '@shared/utils/constants';
import { StatsCard } from '../components/StatsCard';
import { RevenueCard } from '../components/RevenueCard';
import { LowStockCard } from '../components/LowStockCard';
import { RecentOrders } from '../components/RecentOrders';
import { DashboardChart } from '../components/DashboardChart';
import './Dashboard.css';

// One stat-row slot: handles its own loading/error state so a slow query
// doesn't block the other three cards, and applies the staggered
// fade+rise entrance via inline animationDelay.
function StatSlot({ index, isLoading, isError, onRetry, children }) {
  return (
    <div className="col-12 col-sm-6 col-lg-3">
      <div className="dashboard-stat-anim" style={{ animationDelay: `${index * 60}ms` }}>
        {isLoading ? (
          <Skeleton variant="rect" height={84} />
        ) : isError ? (
          <ErrorState heading="Couldn't load" onRetry={onRetry} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}

export function Dashboard() {
  const ordersQuery = useOrders();
  const customersQuery = useCustomers();
  const inventoryQuery = useInventory();

  const totalOrders = ordersQuery.data?.length ?? 0;
  const totalCustomers = customersQuery.data?.length ?? 0;
  const totalUnits = (inventoryQuery.data ?? []).reduce(
    (sum, row) => sum + (Number(row.product_inventory) || 0),
    0
  );
  const lowStockCount = (inventoryQuery.data ?? []).filter(
    (row) => row.product_inventory < LOW_STOCK_THRESHOLD
  ).length;

  return (
    <div className="dashboard-page">
      <h1 className="dashboard-page__title">Dashboard</h1>

      <div className="row g-3">
        <StatSlot index={0} isLoading={ordersQuery.isLoading} isError={ordersQuery.isError} onRetry={ordersQuery.refetch}>
          <StatsCard icon={ShoppingCart} label="Total Orders" value={totalOrders} />
        </StatSlot>

        <StatSlot
          index={1}
          isLoading={customersQuery.isLoading}
          isError={customersQuery.isError}
          onRetry={customersQuery.refetch}
        >
          <StatsCard icon={Users} label="Total Customers" value={totalCustomers} />
        </StatSlot>

        <StatSlot
          index={2}
          isLoading={inventoryQuery.isLoading}
          isError={inventoryQuery.isError}
          onRetry={inventoryQuery.refetch}
        >
          <StatsCard icon={Package} label="Units in Stock" value={totalUnits} />
        </StatSlot>

        <StatSlot
          index={3}
          isLoading={inventoryQuery.isLoading}
          isError={inventoryQuery.isError}
          onRetry={inventoryQuery.refetch}
        >
          <StatsCard
            icon={TriangleAlert}
            label="Low-Stock Items"
            value={lowStockCount}
            tone={lowStockCount > 0 ? 'warning' : 'neutral'}
          />
        </StatSlot>
      </div>

      <div className="row g-3">
        <div className="col-12 col-lg-4">
          <RevenueCard />
        </div>
        <div className="col-12 col-lg-4">
          <LowStockCard />
        </div>
        <div className="col-12 col-lg-4">
          <RecentOrders />
        </div>
      </div>

      <div className="row g-3">
        <div className="col-12">
          <DashboardChart />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
