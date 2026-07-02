import { useEffect } from 'react';
import { useThemeStore } from '@stores/themeStore';
import ToastHost from '@shared/components/common/ToastNotification';
import AppRoutes from './routes';

export default function App() {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <ToastHost />
    </>
  );
}
