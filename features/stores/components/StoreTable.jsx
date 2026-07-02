import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';
import { DataTable } from '@shared/components/common/DataTable';
import { StatusBadge } from '@shared/components/common/StatusBadge';
import './StoreTable.css';

const DEFAULT_EMPTY_STATE = {
  icon: Store,
  heading: 'No stores found',
  body: 'There are no stores to show yet.',
};

function isOnlineStore(row) {
  return Boolean(row.web_address) && !row.physical_address;
}

/**
 * Wraps the shared DataTable primitive with store-specific columns:
 * name, type (Online/Physical), address (web or physical depending on
 * type), and a "View" row action that navigates to the store's detail page.
 *
 * @param {object} props
 * @param {Array<object>} props.rows
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {() => void} [props.onRetry]
 * @param {object} [props.emptyState]
 */
export function StoreTable({ rows, isLoading, isError, onRetry, emptyState }) {
  const navigate = useNavigate();

  const columns = [
    {
      key: 'store_name',
      header: 'Name',
    },
    {
      key: 'type',
      header: 'Type',
      render: (row) =>
        isOnlineStore(row) ? (
          <StatusBadge status="IN_STOCK" label="Online" />
        ) : (
          <span className="store-table__type-plain">Physical</span>
        ),
    },
    {
      key: 'address',
      header: 'Address',
      render: (row) => (isOnlineStore(row) ? row.web_address : row.physical_address ?? '—'),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm store-table__action"
          onClick={() => navigate(`/admin/stores/${row.id}`)}
        >
          View
        </button>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      rows={rows}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      emptyState={emptyState ?? DEFAULT_EMPTY_STATE}
    />
  );
}

export default StoreTable;
