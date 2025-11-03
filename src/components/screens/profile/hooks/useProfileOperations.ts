import { useTheme } from '@/hooks/useTheme';
import { useSettingsStore } from '@/store';
import { useCallback } from 'react';

/**
 * Custom hook for profile operations
 * Follows Single Responsibility Principle - handles profile settings operations
 */
export const useProfileOperations = () => {
  const { isDark } = useTheme();
  const { updateSetting } = useSettingsStore();

  const handleThemeChange = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    updateSetting('themeMode', newMode);
  }, [isDark, updateSetting]);

  return {
    handleThemeChange,
    isDark,
  };
};

