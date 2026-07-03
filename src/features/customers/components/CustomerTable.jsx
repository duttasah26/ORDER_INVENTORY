import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Pencil, Ban, Trash2 } from 'lucide-react';
import { DataTable } from '@shared/components/common/DataTable';
import { ConfirmDialog } from '@shared/components/common/ConfirmDialog';
import { getInitials } from '@shared/utils/helpers';
import { CustomerStatus } from './CustomerStatus';
import { CustomerForm } from './CustomerForm';
import { BanCustomerModal, UnbanButton } from './BanCustomerModal';
import { useDeleteCustomer } from '../hooks/useCustomerMutations';
import './CustomerTable.css';

/**
 * DataTable wraps every column's content in a <td> we don't control, so
 * "click the row to navigate" is implemented by making each non-action
 * cell's inner content fill its cell (via `.customer-table__cell-link`,
 * which cancels the cell's own padding with a matching negative margin)
 * and carry the click handler itself. The actions cell deliberately has no
 * such wrapper, so its buttons never trigger navigation.
 *
 * @param {object} props
 * @param {Array<object>} props.rows
 * @param {boolean} [props.isLoading]
 * @param {boolean} [props.isError]
 * @param {() => void} [props.onRetry]
 * @param {object|React.ReactNode} [props.emptyState]
 * @param {object} [props.pagination]
 */
export function CustomerTable({ rows, isLoading, isError, onRetry, emptyState, pagination }) {
  const navigate = useNavigate();
  const deleteCustomer = useDeleteCustomer();

  const [editingCustomer, setEditingCustomer] = useState(null);
  const [banningCustomer, setBanningCustomer] = useState(null);
  const [deletingCustomer, setDeletingCustomer] = useState(null);

  function goToDetails(customer) {
    navigate(`/admin/customers/${customer.id}`);
  }

  async function handleDeleteConfirm() {
    if (!deletingCustomer) return;
    try {
      await deleteCustomer.mutateAsync(deletingCustomer.id);
      setDeletingCustomer(null);
    } catch {
      // Toast already surfaced by useDeleteCustomer's onError; keep the
      // dialog open so the admin can retry.
    }
  }

  const columns = [
    {
      key: 'avatar',
      header: '',
      width: 48,
      render: (row) => (
        <div className="customer-table__cell-link" onClick={() => goToDetails(row)}>
          <span className="customer-table__avatar">{getInitials(row.full_name)}</span>
        </div>
      ),
    },
    {
      key: 'full_name',
      header: 'Name',
      render: (row) => (
        <div className="customer-table__cell-link" onClick={() => goToDetails(row)}>
          <span className="customer-table__name">{row.full_name}</span>
        </div>
      ),
    },
    {
      key: 'email_address',
      header: 'Email',
      render: (row) => (
        <div className="customer-table__cell-link" onClick={() => goToDetails(row)}>
          <span className="customer-table__email">{row.email_address}</span>
        </div>
      ),
    },
    {
      key: 'isblocked',
      header: 'Status',
      render: (row) => (
        <div className="customer-table__cell-link" onClick={() => goToDetails(row)}>
          <CustomerStatus isblocked={row.isblocked} />
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: 160,
      render: (row) => (
        <div className="customer-table__actions">
          <button
            type="button"
            className="btn btn-outline-secondary customer-table__action"
            onClick={() => setEditingCustomer(row)}
            aria-label={`Edit ${row.full_name}`}
            title="Edit"
          >
            <Pencil size={14} strokeWidth={2} />
          </button>

          {row.isblocked ? (
            <UnbanButton customer={row} className="customer-table__action" />
          ) : (
            <button
              type="button"
              className="btn btn-outline-secondary customer-table__action"
              onClick={() => setBanningCustomer(row)}
              aria-label={`Ban ${row.full_name}`}
              title="Ban"
            >
              <Ban size={14} strokeWidth={2} />
            </button>
          )}

          <button
            type="button"
            className="btn btn-outline-secondary customer-table__action customer-table__action--danger"
            onClick={() => setDeletingCustomer(row)}
            aria-label={`Delete ${row.full_name}`}
            title="Delete"
          >
            <Trash2 size={14} strokeWidth={2} />
          </button>
        </div>
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
        emptyState={emptyState}
        getRowKey={(row) => row.id}
        pagination={pagination}
      />

      {editingCustomer ? (
        <CustomerForm
          isOpen
          onClose={() => setEditingCustomer(null)}
          customer={editingCustomer}
        />
      ) : null}

      {banningCustomer ? (
        <BanCustomerModal
          isOpen
          onClose={() => setBanningCustomer(null)}
          customer={banningCustomer}
        />
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(deletingCustomer)}
        onClose={() => setDeletingCustomer(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete this customer?"
        body={`This will permanently remove ${deletingCustomer?.full_name ?? 'this customer'} and cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDestructive
        isPending={deleteCustomer.isPending}
      />
    </>
  );
}

export default CustomerTable;
