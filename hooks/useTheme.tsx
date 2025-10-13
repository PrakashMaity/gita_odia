import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { Theme, ThemeMode, defaultTheme, generateTheme } from '../constants/theme';
import { useSettingsStore } from '../store/settingsStore';

// Theme Context Interface
interface ThemeContextType {
  theme: Theme;
  currentMode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  isDark: boolean;
}

// Theme Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme Provider Props
interface ThemeProviderProps {
  children: ReactNode;
}

// Theme Provider Component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { settings, updateSetting } = useSettingsStore();
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [systemColorScheme, setSystemColorScheme] = useState<'light' | 'dark'>('light');

  // Listen to system color scheme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme === 'dark' ? 'dark' : 'light');
    });

    // Set initial system color scheme
    setSystemColorScheme(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

    return () => subscription?.remove();
  }, []);

  // Get current mode from settings, handle 'system' mode
  const getCurrentMode = (): 'light' | 'dark' => {
    if (settings.themeMode === 'system') {
      return systemColorScheme;
    }
    return settings.themeMode;
  };

  const currentMode = getCurrentMode();

  // Update theme when mode changes
  useEffect(() => {
    const newTheme = generateTheme(currentMode);
    setTheme(newTheme);
  }, [currentMode]);

  // Toggle between light and dark mode
  const toggleMode = React.useCallback(() => {
    const newMode = currentMode === 'light' ? 'dark' : 'light';
    updateSetting('themeMode', newMode);
  }, [currentMode, updateSetting]);

  // Set mode function
  const setMode = React.useCallback((mode: ThemeMode) => {
    updateSetting('themeMode', mode);
  }, [updateSetting]);

  const contextValue: ThemeContextType = React.useMemo(() => ({
    theme,
    currentMode,
    setMode,
    toggleMode,
    isDark: currentMode === 'dark',
  }), [theme, currentMode, setMode, toggleMode]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom Hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook to get only the theme object
export const useThemeColors = (): Theme => {
  const { theme } = useTheme();
  return theme;
};

// Hook to get theme mode
export const useThemeMode = (): { isDark: boolean; mode: ThemeMode } => {
  const { isDark, currentMode } = useTheme();
  return { isDark, mode: currentMode };
}; 