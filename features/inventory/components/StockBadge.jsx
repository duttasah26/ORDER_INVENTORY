import { StatusBadge } from '@shared/components/common/StatusBadge';
import { LOW_STOCK_THRESHOLD } from '@shared/utils/constants';
import './StockBadge.css';

// The schema has no real "max stock" field for any product/store — 50 is a
// documented assumption used purely to visualize the progress-bar fill
// below. It has no bearing on the in-stock/low-stock/out-of-stock tone
// logic, which is threshold-based against `LOW_STOCK_THRESHOLD`.
const ASSUMED_MAX_STOCK = 50;

/**
 * Derives the canonical stock tone/label for a given quantity. Exported so
 * consumers (InventoryTable, InventoryCard) can decide whether to prefix a
 * warning icon next to a raw quantity number without re-deriving the
 * threshold logic themselves.
 *
 * @param {number} quantity
 * @returns {{status: 'OUT_OF_STOCK'|'LOWSTOCK'|'IN_STOCK', label: string}}
 */
export function getStockTone(quantity) {
  const value = Number(quantity) || 0;
  if (value === 0) {
    return { status: 'OUT_OF_STOCK', label: 'Out of Stock' };
  }
  if (value < LOW_STOCK_THRESHOLD) {
    return { status: 'LOWSTOCK', label: 'Low Stock' };
  }
  return { status: 'IN_STOCK', label: 'In Stock' };
}

/**
 * Domain-specific stock status pill, wrapping the shared `StatusBadge`, plus
 * a thin proportional progress-bar track underneath it.
 *
 * @param {object} props
 * @param {number} props.quantity - `product_inventory` for the row
 */
export function StockBadge({ quantity }) {
  const value = Number(quantity) || 0;
  const { status, label } = getStockTone(value);
  const fillPercent = Math.min(100, Math.max(0, (value / ASSUMED_MAX_STOCK) * 100));

  return (
    <div className="stock-badge">
      <StatusBadge status={status} label={label} />
      <div className="stock-badge__track" role="presentation">
        <div
          className={`stock-badge__fill stock-badge__fill--${status.toLowerCase()}`}
          style={{ width: `${fillPercent}%` }}
        />
      </div>
    </div>
  );
}

export default StockBadge;
