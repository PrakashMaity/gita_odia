import { MenuItem } from '@/constants/menuData';
import { getNavigationHandler } from '../navigationHandlers';
import { useCallback } from 'react';

/**
 * Custom hook for home screen navigation
 * Follows Single Responsibility Principle - handles menu item navigation
 */
export const useHomeNavigation = () => {
  const handleMenuItemPress = useCallback((item: MenuItem) => {
    const handler = getNavigationHandler(item);
    handler();
  }, []);

  return {
    handleMenuItemPress,
  };
};

