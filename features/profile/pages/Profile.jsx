import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { useAuthStore } from '@features/auth/store/authStore';
import { useCustomerOrders } from '@features/customers/hooks/useCustomers';
import { ProfileCard } from '../components/ProfileCard';
import { Loader } from '@shared/components/common/Loader';
import { ErrorState } from '@shared/components/common/ErrorState';
import { EmptyState } from '@shared/components/common/EmptyState';
import { StatusBadge } from '@shared/components/common/StatusBadge';
import { formatDate } from '@shared/utils/helpers';
import './Profile.css';

/** `/profile` — account details card plus the customer's order history. */
export function Profile() {
  const user = useAuthStore((state) => state.user);
  const { data, isLoading, isError, refetch } = useCustomerOrders(user?.id);
  const orders = data?.orders ?? [];

  return (
    <div className="profile-page">
      <ProfileCard user={user} />

      <section className="profile-page__orders">
        <h2 className="profile-page__orders-heading">Order History</h2>

        {isLoading ? (
          <div className="profile-page__loader">
            <Loader />
          </div>
        ) : isError ? (
          <ErrorState onRetry={refetch} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            heading="No orders yet"
            body="Your past orders will show up here once you place one."
          />
        ) : (
          <ul className="profile-page__order-list">
            {orders.map((order) => (
              <li key={order.id} className="profile-page__order-row">
                <Link to={`/my-orders/${order.id}`} className="profile-page__order-link">
                  <span className="profile-page__order-id">Order #{order.order_id ?? order.id}</span>
                  <span className="profile-page__order-date">{formatDate(order.order_tms)}</span>
                  <StatusBadge status={order.order_status} />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default Profile;
