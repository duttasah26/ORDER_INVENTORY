import { ConfirmDialog } from '@shared/components/common/ConfirmDialog';
import { useUpdateCustomer } from '../hooks/useCustomerMutations';
import './BanCustomerModal.css';

/**
 * Confirmation dialog for banning a customer. Ban/unban is not a separate
 * endpoint — it's a PUT to `/customers` with `{id, isblocked}`.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {{id: number, full_name: string}} props.customer
 */
export function BanCustomerModal({ isOpen, onClose, customer }) {
  const updateCustomer = useUpdateCustomer();

  async function handleConfirm() {
    if (!customer) return;
    try {
      await updateCustomer.mutateAsync({ id: customer.id, isblocked: true });
      onClose();
    } catch {
      // Toast already surfaced by useUpdateCustomer's onError; keep dialog
      // open so the admin can retry.
    }
  }

  return (
    <ConfirmDialog
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title="Ban this customer?"
      body={`This will prevent ${customer?.full_name ?? 'this customer'} from placing new orders.`}
      confirmLabel="Ban"
      cancelLabel="Cancel"
      isDestructive
      isPending={updateCustomer.isPending}
    />
  );
}

/**
 * Inline unban action — no confirmation required. Renders a plain button
 * so callers (e.g. row actions) can drop it in without a modal.
 *
 * @param {object} props
 * @param {{id: number}} props.customer
 * @param {string} [props.className]
 */
export function UnbanButton({ customer, className = '' }) {
  const updateCustomer = useUpdateCustomer();

  function handleUnban(event) {
    event.stopPropagation();
    if (!customer) return;
    updateCustomer.mutate({ id: customer.id, isblocked: false });
  }

  return (
    <button
      type="button"
      className={`btn btn-outline-secondary unban-button ${className}`}
      onClick={handleUnban}
      disabled={updateCustomer.isPending}
    >
      Unban
    </button>
  );
}

export default BanCustomerModal;
