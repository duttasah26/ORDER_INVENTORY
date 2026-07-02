import { SearchBar } from '@shared/components/common/SearchBar';
import { useFiltersStore } from '@stores/filtersStore';
import './ProductSearch.css';

/**
 * Thin wrapper around the shared SearchBar, writing the debounced value into
 * `useFiltersStore().products.search`.
 */
export function ProductSearch() {
  const search = useFiltersStore((state) => state.products.search);
  const setFilters = useFiltersStore((state) => state.setFilters);

  return (
    <div className="product-search">
      <SearchBar
        value={search}
        onChange={(value) => setFilters('products', { search: value })}
        placeholder="Search products…"
      />
    </div>
  );
}

export default ProductSearch;
