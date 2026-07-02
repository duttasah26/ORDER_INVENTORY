import { create } from 'zustand';

const INITIAL_FILTERS = {
  products: { search: '', brand: '', colour: '', sortField: '' },
  customers: { search: '', status: '' },
  orders: { search: '', status: '', dateFrom: '', dateTo: '', store: '' },
  inventory: { search: '', storeId: '', category: '', lowStockOnly: false },
};

export const useFiltersStore = create((set) => ({
  products: { ...INITIAL_FILTERS.products },
  customers: { ...INITIAL_FILTERS.customers },
  orders: { ...INITIAL_FILTERS.orders },
  inventory: { ...INITIAL_FILTERS.inventory },

  setFilters: (page, partial) =>
    set((state) => ({
      [page]: { ...state[page], ...partial },
    })),

  resetFilters: (page) =>
    set(() => ({
      [page]: { ...INITIAL_FILTERS[page] },
    })),
}));

export default useFiltersStore;
