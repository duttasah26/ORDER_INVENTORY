import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { CircleCheck, CircleX, Info } from 'lucide-react';
import { useToastStore } from '@stores/toastStore';
import './ToastNotification.css';

const ICONS = {
  success: CircleCheck,
  error: CircleX,
  info: Info,
};

function Toast({ id, type = 'info', message, duration }) {
  const removeToast = useToastStore((state) => state.removeToast);
  const Icon = ICONS[type] ?? ICONS.info;

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, removeToast]);

  return (
    <div className={`toast-notification toast-notification--${type}`} role="status">
      <Icon size={18} strokeWidth={2} className="toast-notification__icon" />
      <span className="toast-notification__message">{message}</span>
      <button
        type="button"
        className="toast-notification__dismiss"
        onClick={() => removeToast(id)}
        aria-label="Dismiss notification"
      >
        &times;
      </button>
    </div>
  );
}

/**
 * Global toast host, driven by `stores/toastStore`. Mount once near the app
 * root (see `app/App.jsx`). Renders into `#toast-root` via a portal.
 */
export function ToastNotification() {
  const toasts = useToastStore((state) => state.toasts);
  const toastRoot = document.getElementById('toast-root');

  if (!toastRoot) {
    return null;
  }

  return createPortal(
    <div className="toast-notification-host">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>,
    toastRoot
  );
}

export default ToastNotification;
