export const typography = {
  fontFamily: {
    system: 'System',
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  size: {
    display: 32,
    title: 24,
    heading: 20,
    body: 16,
    label: 14,
    caption: 12,
  },
  lineHeight: {
    display: 40,
    title: 32,
    heading: 28,
    body: 24,
    label: 20,
    caption: 18,
  },
} as const;

export type TypographyToken = typeof typography;
