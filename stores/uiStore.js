import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isSidebarCollapsed: false,
  activeModal: null,
  modalPayload: null,
  globalLoading: false,

  toggleSidebar: () =>
    set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  openModal: (id, payload = null) => set({ activeModal: id, modalPayload: payload }),
  closeModal: () => set({ activeModal: null, modalPayload: null }),
  setGlobalLoading: (isLoading) => set({ globalLoading: isLoading }),
}));

export default useUIStore;
