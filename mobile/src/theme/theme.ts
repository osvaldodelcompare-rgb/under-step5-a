export const colors = {
  background: '#0B0B0F',
  surface: '#16151C',
  surfaceAlt: '#1F1E27',
  border: '#2A2932',
  primary: '#B026FF',
  primaryMuted: '#5A2680',
  accent: '#00E5C7',
  text: '#F5F3F7',
  textMuted: '#9C99A8',
  textFaint: '#5F5D6B',
  danger: '#FF4D6D',
  success: '#39D98A',
  event: '#B026FF',
  promo: '#00E5C7',
  merch: '#FFB454',
  news: '#5C9DFF',
};

export const postTypeColors: Record<string, string> = {
  event: colors.event,
  promo: colors.promo,
  merch: colors.merch,
  news: colors.news,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 14,
  lg: 22,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: colors.text },
  h2: { fontSize: 22, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 17, fontWeight: '700' as const, color: colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: 12, fontWeight: '500' as const, color: colors.textFaint },
  button: { fontSize: 15, fontWeight: '700' as const, color: colors.text },
};
