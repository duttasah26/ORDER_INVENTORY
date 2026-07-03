import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import { useFiltersStore } from '@stores/filtersStore';
import { useStores } from '@features/stores/hooks/useStores';
import { useProducts } from '@features/products/hooks/useProducts';
import { LOW_STOCK_THRESHOLD } from '@shared/utils/constants';
import { useInventory } from '../hooks/useInventory';
import { InventoryTable } from '../components/InventoryTable';
import { RestockModal } from '../components/RestockModal';
import './Inventory.css';

/**
 * Admin inventory page — route `/admin/inventory`.
 */
export function Inventory() {
  const filters = useFiltersStore((state) => state.inventory);
  const setFilters = useFiltersStore((state) => state.setFilters);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: stores = [] } = useStores();
  const { data: products = [] } = useProducts();

  const selectedStoreId = filters.storeId ? Number(filters.storeId) : undefined;
  const {
    data: inventoryRows = [],
    isLoading,
    isError,
    refetch,
  } = useInventory(selectedStoreId);

  // Products have no real "category" field in this schema — the control is
  // labeled "Category" per the design doc but is populated from (and
  // filters by) the product `brand` field instead, same interpretation the
  // server uses for GET /inventory/category/:category.
  const categoryOptions = useMemo(() => {
    const brands = new Set(products.map((product) => product.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  const filteredRows = useMemo(() => {
    return inventoryRows.filter((row) => {
      if (filters.category && row.product?.brand !== filters.category) {
        return false;
      }
      if (filters.lowStockOnly && row.product_inventory >= LOW_STOCK_THRESHOLD) {
        return false;
      }
      return true;
    });
  }, [inventoryRows, filters.category, filters.lowStockOnly]);

  return (
    <div className="inventory-page">
      <div className="inventory-page__header">
        <h1 className="inventory-page__title">Inventory</h1>
        <button type="button" className="btn btn-primary" onClick={() => setIsCreateOpen(true)}>
          <Plus size={16} strokeWidth={2} aria-hidden="true" />
          Adjust Stock
        </button>
      </div>

      <div className="inventory-page__filters">
        <div className="inventory-page__filter">
          <label htmlFor="inventory-store-filter" className="inventory-page__filter-label">
            Store
          </label>
          <select
            id="inventory-store-filter"
            className="form-select"
            value={filters.storeId}
            onChange={(event) => setFilters('inventory', { storeId: event.target.value })}
          >
            <option value="">All stores</option>
            {stores.map((store) => (
              <option key={store.id} value={store.store_id}>
                {store.store_name}
              </option>
            ))}
          </select>
        </div>

        <div className="inventory-page__filter">
          <label htmlFor="inventory-category-filter" className="inventory-page__filter-label">
            Category
          </label>
          <select
            id="inventory-category-filter"
            className="form-select"
            value={filters.category}
            onChange={(event) => setFilters('inventory', { category: event.target.value })}
          >
            <option value="">All categories</option>
            {categoryOptions.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="inventory-page__filter inventory-page__filter--switch">
          <label
            className="form-check form-switch inventory-page__switch-label"
            htmlFor="inventory-low-stock-toggle"
          >
            <input
              id="inventory-low-stock-toggle"
              className="form-check-input inventory-page__switch-input"
              type="checkbox"
              role="switch"
              checked={filters.lowStockOnly}
              onChange={(event) => setFilters('inventory', { lowStockOnly: event.target.checked })}
            />
            Show low stock only
          </label>
        </div>
      </div>

      <InventoryTable
        rows={filteredRows}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      />

      <RestockModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} inventoryRow={null} />
    </div>
  );
}

export default Inventory;
