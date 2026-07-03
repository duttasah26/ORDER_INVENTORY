import { create } from 'zustand';
import { persist } from 'zustand/middleware';

function getInitialTheme() {
  try {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
  } catch {
    // ignore and fall back to default
  }
  return 'light';
}

export const useThemeStore = create(
  persist(
    (set) => ({
      theme: getInitialTheme(),
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'oims-theme',
    }
  )
);

export default useThemeStore;
