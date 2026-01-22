// Theme configuration
// Design tokens will be extracted from Figma and added here

export const colors = {
  primary: '#000000', // To be updated from Figma
  secondary: '#666666', // To be updated from Figma
  accent: '#007AFF', // To be updated from Figma
  background: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
    disabled: '#CCCCCC',
  },
  status: {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
  },
};

export const typography = {
  fontFamily: {
    primary: 'System',
    secondary: 'System',
  },
  fontSize: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 18,
    body: 16,
    caption: 14,
    small: 12,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    bold: '700' as const,
  },
  lineHeight: {
    h1: 40,
    h2: 32,
    h3: 28,
    h4: 24,
    body: 24,
    caption: 20,
    small: 16,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const theme = {
  colors,
  typography,
  spacing,
};

export type Theme = typeof theme;
