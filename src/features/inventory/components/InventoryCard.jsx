import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import { StockBadge, getStockTone } from './StockBadge';
import { RestockModal } from './RestockModal';
import './InventoryCard.css';

/**
 * Card view of a single per-SKU/store inventory row — the same row shape
 * `InventoryTable` renders, laid out for a grid instead of a table.
 *
 * @param {object} props
 * @param {object} props.row - inventory row `{..., product, store}`
 */
export function InventoryCard({ row }) {
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const { status } = getStockTone(row.product_inventory);

  return (
    <div className="inventory-card">
      <div className="inventory-card__header">
        <span
          className="inventory-card__colour-dot"
          style={{ background: row.product?.colour }}
          aria-hidden="true"
        />
        <div className="inventory-card__titles">
          <p className="inventory-card__product-name">
            {row.product?.product_name ?? 'Unknown product'}
          </p>
          <p className="inventory-card__store-name">{row.store?.store_name ?? 'Unknown store'}</p>
        </div>
      </div>

      <div className="inventory-card__quantity-row">
        <span className="inventory-card__quantity-value">
          {status === 'LOWSTOCK' ? (
            <TriangleAlert
              size={14}
              strokeWidth={2}
              className="inventory-card__low-icon"
              aria-hidden="true"
            />
          ) : null}
          {row.product_inventory} units
        </span>
      </div>

      <StockBadge quantity={row.product_inventory} />

      <button
        type="button"
        className="btn btn-outline-secondary btn-sm inventory-card__action"
        onClick={() => setIsRestockOpen(true)}
      >
        Adjust Stock
      </button>

      <RestockModal
        isOpen={isRestockOpen}
        onClose={() => setIsRestockOpen(false)}
        inventoryRow={row}
      />
    </div>
  );
}

export default InventoryCard;
