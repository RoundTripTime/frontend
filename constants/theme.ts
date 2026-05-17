/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

import { appThemes } from '@/src/theme';

const tintColorLight = appThemes.light.semantic.primary;
const tintColorDark = appThemes.dark.semantic.primary;

export const Colors = {
  light: {
    text: appThemes.light.semantic.text,
    background: appThemes.light.semantic.background,
    tint: tintColorLight,
    icon: appThemes.light.semantic.textMuted,
    tabIconDefault: appThemes.light.semantic.textMuted,
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: appThemes.dark.semantic.text,
    background: appThemes.dark.semantic.background,
    tint: tintColorDark,
    icon: appThemes.dark.semantic.textMuted,
    tabIconDefault: appThemes.dark.semantic.textMuted,
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
