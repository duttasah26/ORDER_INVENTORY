import { Link } from 'react-router-dom';
import { useOrders } from '@features/orders/hooks/useOrders';
import { DataTable } from '@shared/components/common/DataTable';
import { StatusBadge } from '@shared/components/common/StatusBadge';
import { formatDate } from '@shared/utils/helpers';
import { getOrderStatusDisplay } from '@shared/utils/constants';
import './RecentOrders.css';

const RECENT_ORDER_COUNT = 5;

export function RecentOrders() {
  const { data: orders = [], isLoading, isError, refetch } = useOrders();

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.order_tms) - new Date(a.order_tms))
    .slice(0, RECENT_ORDER_COUNT);

  const columns = [
    {
      key: 'order_id',
      header: 'Order ID',
      render: (row) => (
        <Link to={`/admin/orders/${row.order_id ?? row.id}`} className="recent-orders__link">
          #{row.order_id ?? row.id}
        </Link>
      ),
    },
    {
      key: 'order_tms',
      header: 'Date',
      render: (row) => formatDate(row.order_tms),
    },
    {
      key: 'order_status',
      header: 'Status',
      render: (row) => {
        const display = getOrderStatusDisplay(row.order_status);
        return <StatusBadge status={display.key} label={display.label} />;
      },
    },
  ];

  return (
    <div className="recent-orders">
      <div className="recent-orders__header">
        <h3 className="recent-orders__title">Recent Orders</h3>
        <Link to="/admin/orders" className="recent-orders__view-all">
          View all →
        </Link>
      </div>

      <DataTable
        columns={columns}
        rows={recentOrders}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        getRowKey={(row) => row.id ?? row.order_id}
        emptyState={{ heading: 'No recent orders', body: 'Orders will show up here once placed.' }}
      />
    </div>
  );
}

export default RecentOrders;
