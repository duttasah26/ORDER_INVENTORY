import { Modal } from './Modal';
import { Loader } from './Loader';
import './ConfirmDialog.css';

/**
 * Confirmation dialog built on top of Modal. Destructive actions (the
 * default) style the confirm button solid red with the neutral/cancel
 * button as an outline button positioned to its left, so the safe option
 * reads first.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {() => void} props.onConfirm
 * @param {string} props.title
 * @param {React.ReactNode} props.body
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {boolean} [props.isDestructive]
 * @param {boolean} [props.isPending]
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = true,
  isPending = false,
}) {
  const footer = (
    <div className="confirm-dialog__actions">
      <button
        type="button"
        className="btn btn-outline-secondary confirm-dialog__cancel"
        onClick={onClose}
        disabled={isPending}
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        className={`btn confirm-dialog__confirm ${
          isDestructive ? 'confirm-dialog__confirm--destructive' : 'btn-primary'
        }`}
        onClick={onConfirm}
        disabled={isPending}
      >
        {isPending ? <Loader size="sm" /> : null}
        {confirmLabel}
      </button>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm" footer={footer}>
      <p className="confirm-dialog__body">{body}</p>
    </Modal>
  );
}

export default ConfirmDialog;
