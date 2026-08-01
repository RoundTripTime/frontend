import { StyleSheet } from 'react-native-unistyles';

import { appThemes } from './themes';

StyleSheet.configure({
  themes: appThemes,
  settings: {
    initialTheme: 'light',
  },
});

declare module 'react-native-unistyles' {
  export interface UnistylesThemes {
    light: typeof appThemes.light;
    dark: typeof appThemes.dark;
  }
}
