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
    surfaceRaised: colors.white,
    text: colors.ink,
    textSecondary: colors.gray700,
    textMuted: colors.gray500,
    placeholder: colors.gray400,
    border: colors.border,
    borderStrong: colors.gray300,
    primary: colors.primary,
    primarySoft: colors.primarySoft,
    primaryDeep: colors.primaryDeep,
    onPrimary: colors.white,
    accent: colors.orange,
    accentSoft: colors.orangeSoft,
    accentDeep: colors.orangeDeep,
    success: colors.green600,
    successSoft: colors.green50,
    danger: colors.red600,
    dangerSoft: colors.red50,
    warning: colors.orange800,
    warningSoft: colors.orange50,
    disabled: colors.gray300,
    input: colors.gray50,
    mediaPlaceholder: colors.gray200,
    kakao: colors.kakao,
    onKakao: colors.slate,
  },
} as const;

export const darkTheme = {
  ...baseTheme,
  colorScheme: 'dark',
  semantic: {
    background: '#241A14',
    surface: '#2E231C',
    surfaceMuted: '#3A2D24',
    surfaceRaised: '#37291F',
    text: '#FFF7ED',
    textSecondary: '#FED7AA',
    textMuted: '#FDBA74',
    placeholder: '#FB923C',
    border: '#5A4031',
    borderStrong: '#7C4A2D',
    primary: colors.orange,
    primarySoft: '#3A2416',
    primaryDeep: '#FDBA74',
    onPrimary: '#1F130C',
    accent: colors.orange,
    accentSoft: '#4A2E1B',
    accentDeep: '#FDBA74',
    success: '#86EFAC',
    successSoft: '#123524',
    danger: '#FCA5A5',
    dangerSoft: '#3F1717',
    warning: '#FDBA74',
    warningSoft: '#3A2416',
    disabled: '#7C4A2D',
    input: '#3A2D24',
    mediaPlaceholder: '#4B382D',
    kakao: colors.kakao,
    onKakao: colors.slate,
  },
} as const;

export const appThemes = {
  light: lightTheme,
  dark: darkTheme,
} as const;

export type AppTheme = (typeof appThemes)[keyof typeof appThemes];
