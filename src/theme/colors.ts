export const colors = {
  white: '#FFFFFF',

  primary: '#3182F6',
  primarySoft: '#E8F2FF',
  primaryDeep: '#1B64DA',

  orange: '#FF7A00',
  orangeSoft: '#FFF1E3',
  orangeDeep: '#E85D00',

  ink: '#191F28',
  gray700: '#4E5968',
  gray500: '#8B95A1',
  border: '#E5E8EB',
  tint: '#F2F4F6',
} as const;

export type ColorToken = keyof typeof colors;
