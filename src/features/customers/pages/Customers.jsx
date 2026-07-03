import { useMemo, useState } from 'react';
import { Users, SearchX } from 'lucide-react';
import { SearchBar } from '@shared/components/common/SearchBar';
import { usePagination } from '@shared/hooks/usePagination';
import { useFiltersStore } from '@stores/filtersStore';
import { CustomerTable } from '../components/CustomerTable';
import { CustomerForm } from '../components/CustomerForm';
import { useCustomers } from '../hooks/useCustomers';
import './Customers.css';

const PAGE_SIZE = 10;

/**
 * Admin customers list (`/admin/customers`). The page title itself is
 * rendered by AdminLayout's Header (derived from the route), so this page
 * only owns the toolbar (search + status filter + Add Customer) and the
 * table.
 */
export function Customers() {
  const { data: customers, isLoading, isError, refetch } = useCustomers();
  const filters = useFiltersStore((state) => state.customers);
  const setFilters = useFiltersStore((state) => state.setFilters);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    const search = filters.search.trim().toLowerCase();

    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        customer.full_name.toLowerCase().includes(search) ||
        customer.email_address.toLowerCase().includes(search);

      const matchesStatus =
        !filters.status ||
        (filters.status === 'active' && !customer.isblocked) ||
        (filters.status === 'banned' && customer.isblocked);

      return matchesSearch && matchesStatus;
    });
  }, [customers, filters.search, filters.status]);

  const { page, setPage, totalPages, pageItems } = usePagination({
    totalItems: filteredCustomers.length,
    pageSize: PAGE_SIZE,
  });

  const pagedCustomers = pageItems(filteredCustomers);
  const hasAnyCustomers = (customers?.length ?? 0) > 0;
  const hasFiltersApplied = Boolean(filters.search || filters.status);

  let emptyState;
  if (!hasAnyCustomers) {
    emptyState = {
      icon: Users,
      heading: 'No customers yet',
      body: 'Add your first customer to get started.',
      action: { label: '+ Add Customer', onClick: () => setIsAddOpen(true) },
    };
  } else if (hasFiltersApplied) {
    emptyState = {
      icon: SearchX,
      heading: 'No customers found',
      body: 'Try a different search term or clear your filters.',
    };
  }

  return (
    <div className="customers-page">
      <div className="customers-page__toolbar">
        <div className="customers-page__filters">
          <SearchBar
            value={filters.search}
            onChange={(value) => setFilters('customers', { search: value })}
            placeholder="Search customers…"
          />
          <select
            className="form-select customers-page__status-filter"
            value={filters.status}
            onChange={(event) => setFilters('customers', { status: event.target.value })}
            aria-label="Filter by status"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="banned">Banned</option>
          </select>
        </div>

        <button type="button" className="btn btn-primary" onClick={() => setIsAddOpen(true)}>
          + Add Customer
        </button>
      </div>

      <CustomerTable
        rows={pagedCustomers}
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
        emptyState={emptyState}
        pagination={
          filteredCustomers.length > PAGE_SIZE ? { page, totalPages, onPageChange: setPage } : undefined
        }
      />

      <CustomerForm isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
    </div>
  );
}

export default Customers;
