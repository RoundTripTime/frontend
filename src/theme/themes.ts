import { colors } from './colors';
import { typography } from './typography';

const baseTheme = {
  colors,
  typography,
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
  },
} as const;

export const lightTheme = {
  ...baseTheme,
  colorScheme: 'light',
  semantic: {
    background: colors.white,
    surface: colors.white,
    surfaceMuted: colors.tint,
    text: colors.ink,
    textSecondary: colors.gray700,
    textMuted: colors.gray500,
    border: colors.border,
    primary: colors.primary,
    primarySoft: colors.primarySoft,
    primaryDeep: colors.primaryDeep,
  },
} as const;

export const darkTheme = {
  ...baseTheme,
  colorScheme: 'dark',
  semantic: {
    background: colors.white,
    surface: colors.white,
    surfaceMuted: colors.tint,
    text: colors.ink,
    textSecondary: colors.gray700,
    textMuted: colors.gray500,
    border: colors.border,
    primary: colors.primary,
    primarySoft: colors.primarySoft,
    primaryDeep: colors.primaryDeep,
  },
} as const;

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type AppTheme = typeof lightTheme;
