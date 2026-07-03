import { create } from 'zustand';

export const useOrderDraftStore = create((set, get) => ({
  customerId: null,
  storeId: null,
  lines: [],

  setCustomer: (customerId) => set({ customerId }),
  setStore: (storeId) => set({ storeId }),

  addLine: (line) =>
    set((state) => {
      const existing = state.lines.find((item) => item.productId === line.productId);
      if (existing) {
        return {
          lines: state.lines.map((item) =>
            item.productId === line.productId
              ? { ...item, quantity: item.quantity + line.quantity }
              : item
          ),
        };
      }
      return { lines: [...state.lines, line] };
    }),

  updateLine: (productId, quantity) =>
    set((state) => ({
      lines: state.lines.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    })),

  removeLine: (productId) =>
    set((state) => ({
      lines: state.lines.filter((item) => item.productId !== productId),
    })),

  reset: () => set({ customerId: null, storeId: null, lines: [] }),

  getTotal: () => {
    return get().lines.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0);
  },
}));

export default useOrderDraftStore;
