// Color scheme based on onehatmockup/oldapp
export const colors = {
  // Brand colors
  brandTeal: '#26bc9f', // --brand-teal: 168 49% 44%
  brandNavy: '#1c2f7f', // --brand-navy: 232 62% 31%
  
  // Background and foreground
  background: '#f8fafc', // --background: 248 250 252
  foreground: '#2e3a48', // --foreground: 215 25% 27%
  
  // Card
  card: '#ffffff', // --card: 255 255 255
  cardForeground: '#2e3a48', // --card-foreground: 215 25% 27%
  
  // Primary
  primary: '#13c2a5', // --primary: 176 87% 35%
  primaryForeground: '#ffffff', // --primary-foreground: 255 255 255
  
  // Secondary
  secondary: '#e6f7f4', // --secondary: 176 42% 94%
  secondaryForeground: '#0e8b75', // --secondary-foreground: 176 87% 25%
  
  // Muted
  muted: '#f1f5f9', // --muted: 210 40% 96%
  mutedForeground: '#64748b', // --muted-foreground: 215 16% 47%
  
  // Accent
  accent: '#26bca9', // --accent: 176 51% 48%
  accentForeground: '#ffffff', // --accent-foreground: 255 255 255
  
  // Destructive
  destructive: '#e11d48', // --destructive: 0 84% 60%
  destructiveForeground: '#ffffff', // --destructive-foreground: 255 255 255
  
  // Border and input
  border: '#e2e8f0', // --border: 214 32% 91%
  input: '#e2e8f0', // --input: 214 32% 91%
  ring: '#13c2a5', // --ring: 176 87% 35%
  
  // Status colors
  success: '#16a34a', // --success: 142 76% 36%
  successForeground: '#ffffff', // --success-foreground: 255 255 255
  warning: '#facc15', // --warning: 38 92% 50%
  warningForeground: '#ffffff', // --warning-foreground: 255 255 255
  info: '#0ea5e9', // --info: 199 89% 48%
  infoForeground: '#ffffff', // --info-foreground: 255 255 255
};

// Radius
export const radius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 24,
  '3xl': 32,
  full: 9999,
};

// Spacing
export const spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
  32: 128,
  40: 160,
  48: 192,
  56: 224,
  64: 256,
};

// Font sizes
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 60,
};

// Font weights
export const fontWeight = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900',
};

// Line heights
export const lineHeight = {
  none: 1,
  tight: 1.25,
  snug: 1.375,
  normal: 1.5,
  relaxed: 1.625,
  loose: 2,
};

export default {
  colors,
  radius,
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
};
