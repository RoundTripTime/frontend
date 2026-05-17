import { useColorScheme } from '@/hooks/use-color-scheme';

import { appThemes } from './themes';

export function useAppTheme() {
  const colorScheme = useColorScheme();

  return appThemes[colorScheme === 'dark' ? 'dark' : 'light'];
}
