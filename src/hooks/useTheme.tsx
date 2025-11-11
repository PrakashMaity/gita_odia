import React, { ReactNode, createContext, useContext, useMemo } from 'react';
import { Theme, defaultTheme } from '@/constants/theme';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const contextValue = useMemo<ThemeContextType>(() => ({
    theme: defaultTheme,
  }), []);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeColors = (): Theme => {
  const { theme } = useTheme();
  return theme;
};