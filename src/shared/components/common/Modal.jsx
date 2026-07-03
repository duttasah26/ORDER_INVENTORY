import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import './Modal.css';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Hand-rolled modal (no Bootstrap JS). Renders into `#modal-root` via a
 * portal. Handles backdrop click / Escape to close, a basic focus trap, and
 * body scroll locking while open.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onClose
 * @param {string} props.title
 * @param {React.ReactNode} props.children
 * @param {'sm'|'md'|'lg'} [props.size]
 * @param {React.ReactNode} [props.footer]
 */
export function Modal({ isOpen, onClose, title, children, size = 'md', footer }) {
  const panelRef = useRef(null);
  const previouslyFocusedRef = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    previouslyFocusedRef.current = document.activeElement;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const panel = panelRef.current;
    const focusable = panel?.querySelectorAll(FOCUSABLE_SELECTOR);
    const firstFocusable = focusable?.[0];
    (firstFocusable ?? panel)?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose();
        return;
      }

      if (event.key === 'Tab' && panelRef.current) {
        const focusableEls = panelRef.current.querySelectorAll(FOCUSABLE_SELECTOR);
        if (focusableEls.length === 0) {
          event.preventDefault();
          return;
        }

        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.body.style.overflow = previousOverflow;
      previouslyFocusedRef.current?.focus?.();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    return null;
  }

  function handleBackdropMouseDown(event) {
    if (event.target === event.currentTarget) {
      onClose();
    }
  }

  return createPortal(
    <div className="modal-backdrop" onMouseDown={handleBackdropMouseDown}>
      <div
        ref={panelRef}
        className={`modal-content modal-content--${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <div className="modal-content__header">
          <h2 id={titleId} className="modal-content__title">
            {title}
          </h2>
          <button
            type="button"
            className="modal-content__close"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-content__body">{children}</div>

        {footer ? <div className="modal-content__footer">{footer}</div> : null}
      </div>
    </div>,
    modalRoot
  );
}

export default Modal;
