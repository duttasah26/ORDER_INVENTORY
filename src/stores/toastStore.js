import { create } from 'zustand';

function generateId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type, message, duration = 4000 }) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, duration }],
    }));
    return id;
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));

export default useToastStore;
