import React, { createContext, useContext, ReactNode } from 'react';
import { colors, radius, spacing, fontSize, fontWeight, lineHeight } from './colors';

// Define the theme type
export type Theme = {
  colors: typeof colors;
  radius: typeof radius;
  spacing: typeof spacing;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
};

// Create the theme object
const theme: Theme = {
  colors,
  radius,
  spacing,
  fontSize,
  fontWeight,
  lineHeight,
};

// Create the context
const ThemeContext = createContext<Theme>(theme);

// Create a hook to use the theme
export const useTheme = () => useContext(ThemeContext);

// Create the provider component
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
