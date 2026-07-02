import { useMemo } from 'react';
import { useFiltersStore } from '@stores/filtersStore';
import { useProducts } from '../hooks/useProducts';
import './ProductFilter.css';

const SORT_OPTIONS = [
  { value: '', label: 'Sort by…' },
  { value: 'unit_price', label: 'Price' },
  { value: 'product_name', label: 'Name' },
  { value: 'rating', label: 'Rating' },
];

/**
 * Brand / colour / sort-by dropdowns, writing straight into
 * `useFiltersStore().products`. Options are derived from whatever
 * `useProducts()` currently has loaded.
 */
export function ProductFilter() {
  const { data: products = [] } = useProducts();
  const filters = useFiltersStore((state) => state.products);
  const setFilters = useFiltersStore((state) => state.setFilters);

  const brandOptions = useMemo(() => {
    const brands = new Set(products.map((product) => product.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  const colourOptions = useMemo(() => {
    const colours = new Set(products.map((product) => product.colour).filter(Boolean));
    return Array.from(colours).sort();
  }, [products]);

  return (
    <div className="product-filter">
      <select
        className="form-select product-filter__select"
        aria-label="Filter by brand"
        value={filters.brand}
        onChange={(event) => setFilters('products', { brand: event.target.value })}
      >
        <option value="">All brands</option>
        {brandOptions.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select
        className="form-select product-filter__select"
        aria-label="Filter by colour"
        value={filters.colour}
        onChange={(event) => setFilters('products', { colour: event.target.value })}
      >
        <option value="">All colours</option>
        {colourOptions.map((colour) => (
          <option key={colour} value={colour}>
            {colour}
          </option>
        ))}
      </select>

      <select
        className="form-select product-filter__select"
        aria-label="Sort products"
        value={filters.sortField}
        onChange={(event) => setFilters('products', { sortField: event.target.value })}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ProductFilter;
