import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const INITIAL_STATE = {
  user: null,
  isAuthenticated: false,
};

export const useAuthStore = create(
  persist(
    (set) => ({
      ...INITIAL_STATE,

      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ ...INITIAL_STATE }),
    }),
    {
      name: 'oims-auth',
    }
  )
);

export default useAuthStore;
