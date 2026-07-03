import { useState } from 'react';
import { PackageSearch, TriangleAlert } from 'lucide-react';
import { DataTable } from '@shared/components/common/DataTable';
import { StockBadge, getStockTone } from './StockBadge';
import { RestockModal } from './RestockModal';
import './InventoryTable.css';

const DEFAULT_EMPTY_STATE = {
  icon: PackageSearch,
  heading: 'No inventory records found',
  body: 'Try a different store or search term.',
};

/**
 * Wraps the shared DataTable primitive with inventory-specific columns.
 * Deliberately avoids cross-importing the Products feature's `ProductImage`
 * component (to keep features decoupled) — the colour swatch is just an
 * inline-styled `<span>` using `row.product?.colour`.
 *
 * @param {object} props
 * @param {Array<object>} props.rows - inventory rows `{..., product, store}`
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {() => void} [props.onRetry]
 * @param {object} [props.emptyState]
 */
export function InventoryTable({ rows, isLoading, isError, onRetry, emptyState }) {
  const [restockRow, setRestockRow] = useState(null);

  const columns = [
    {
      key: 'product',
      header: 'Product',
      render: (row) => (
        <div className="inventory-table__product-cell">
          <span
            className="inventory-table__colour-dot"
            style={{ background: row.product?.colour }}
            aria-hidden="true"
          />
          <span className="inventory-table__product-name">
            {row.product?.product_name ?? 'Unknown product'}
          </span>
        </div>
      ),
    },
    {
      key: 'store',
      header: 'Store',
      render: (row) => row.store?.store_name ?? 'Unknown store',
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (row) => {
        const { status } = getStockTone(row.product_inventory);
        return (
          <div className="inventory-table__quantity-cell">
            <span className="inventory-table__quantity-value">
              {status === 'LOWSTOCK' ? (
                <TriangleAlert
                  size={14}
                  strokeWidth={2}
                  className="inventory-table__low-icon"
                  aria-hidden="true"
                />
              ) : null}
              {row.product_inventory}
            </span>
            <StockBadge quantity={row.product_inventory} />
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm inventory-table__action"
          onClick={() => setRestockRow(row)}
        >
          Adjust Stock
        </button>
      ),
    },
  ];

  return (
    <>
      <DataTable
        columns={columns}
        rows={rows}
        isLoading={isLoading}
        isError={isError}
        onRetry={onRetry}
        emptyState={emptyState ?? DEFAULT_EMPTY_STATE}
      />

      <RestockModal
        isOpen={Boolean(restockRow)}
        onClose={() => setRestockRow(null)}
        inventoryRow={restockRow}
      />
    </>
  );
}

export default InventoryTable;
