import { useThemeStore } from '@stores/themeStore';

export function useTheme() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return { theme, toggleTheme };
}

export default useTheme;
