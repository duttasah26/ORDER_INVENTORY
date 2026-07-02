import { TriangleAlert, PackageCheck } from 'lucide-react';
import { useInventory } from '@features/inventory/hooks/useInventory';
import { LOW_STOCK_THRESHOLD } from '@shared/utils/constants';
import { Skeleton } from '@shared/components/common/Skeleton';
import { ErrorState } from '@shared/components/common/ErrorState';
import { EmptyState } from '@shared/components/common/EmptyState';
import './LowStockCard.css';

/**
 * "Low Stock Alerts" list (design doc §9.2). Filters inventory rows below
 * LOW_STOCK_THRESHOLD and lists each as product name + remaining quantity.
 */
export function LowStockCard() {
  const { data: inventory = [], isLoading, isError, refetch } = useInventory();

  const lowStockRows = inventory.filter((row) => row.product_inventory < LOW_STOCK_THRESHOLD);

  return (
    <div className="low-stock-card">
      <h3 className="low-stock-card__title">Low Stock Alerts</h3>

      {isLoading ? (
        <div className="low-stock-card__skeleton">
          <Skeleton variant="text" count={4} height={20} />
        </div>
      ) : isError ? (
        <ErrorState heading="Couldn't load inventory" onRetry={refetch} />
      ) : lowStockRows.length === 0 ? (
        <EmptyState icon={PackageCheck} heading="All stock levels are healthy" />
      ) : (
        <ul className="low-stock-card__list">
          {lowStockRows.map((row) => (
            <li key={row.id ?? row.inventory_id} className="low-stock-card__row">
              <TriangleAlert className="low-stock-card__icon" size={16} strokeWidth={1.75} aria-hidden="true" />
              <span className="low-stock-card__name">{row.product?.product_name ?? 'Unknown product'}</span>
              <span className="low-stock-card__qty tabular-nums">{row.product_inventory} left</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default LowStockCard;
