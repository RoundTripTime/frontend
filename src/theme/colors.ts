export const colors = {
  white: '#FFFFFF',

  primary: '#3182F6',
  primarySoft: '#E8F2FF',
  primaryDeep: '#1B64DA',

  orange: '#FF7A00',
  orangeSoft: '#FFF1E3',
  orangeDeep: '#E85D00',

  ink: '#191F28',
  slate: '#111827',
  gray700: '#4E5968',
  gray600: '#374151',
  gray500: '#8B95A1',
  gray400: '#9CA3AF',
  gray300: '#D1D5DB',
  gray200: '#E5E7EB',
  gray100: '#F3F4F6',
  gray50: '#F9FAFB',
  border: '#E5E8EB',
  tint: '#F2F4F6',

  orange50: '#FFF7ED',
  orange100: '#FFEDD5',
  orange700: '#C2410C',
  orange800: '#9A3412',

  green600: '#16A34A',
  green50: '#F0FDF4',

  red600: '#DC2626',
  red50: '#FEF2F2',

  kakao: '#FEE500',
} as const;

export type ColorToken = keyof typeof colors;
