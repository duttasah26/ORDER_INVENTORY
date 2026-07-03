import { Store as StoreIcon } from 'lucide-react';
import { Skeleton } from '@shared/components/common/Skeleton';
import { ErrorState } from '@shared/components/common/ErrorState';
import { EmptyState } from '@shared/components/common/EmptyState';
import { StoreCard } from '../components/StoreCard';
import { useStores } from '../hooks/useStores';
import './Stores.css';

/**
 * Admin stores list — route `/admin/stores`. Read-only in this build (no
 * create/edit/delete UI): a simple card grid, one tile per store, each
 * linking through to `/admin/stores/:id`. 23 seed stores always exist, so
 * the empty state is unlikely to trigger in practice but is still handled.
 */
export function Stores() {
  const { data: stores, isLoading, isError, refetch } = useStores();

  return (
    <div className="stores-page">
      <h1 className="stores-page__title">Stores</h1>

      {isLoading ? (
        <div className="stores-page__grid">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} variant="rect" height={180} />
          ))}
        </div>
      ) : isError ? (
        <ErrorState body="Couldn't load stores." onRetry={refetch} />
      ) : stores?.length ? (
        <div className="stores-page__grid">
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} showDetailsLink />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={StoreIcon}
          heading="No stores found"
          body="There are no stores to show yet."
        />
      )}
    </div>
  );
}

export default Stores;
