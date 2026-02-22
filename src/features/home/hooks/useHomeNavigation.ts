import { MenuItem } from '@/constants/menuData';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useRewardedInterstitialAd } from '@/hooks/useRewardedInterstitialAd';
import { useRef } from 'react';
import { getNavigationHandler } from '../navigationHandlers';
import { useCallback } from 'react';

/**
 * Custom hook for home screen navigation
 * Follows Single Responsibility Principle - handles menu item navigation
 */
export const useHomeNavigation = () => {
  const { showAd, isLoaded } = useInterstitialAd();
  const { showAd: showRewardedInterstitialAd, isLoaded: isRewardedLoaded } = useRewardedInterstitialAd();
  const navigationCountRef = useRef(0);

  const handleMenuItemPress = useCallback((item: MenuItem) => {
    const handler = getNavigationHandler(item);
    handler();

    navigationCountRef.current += 1;
    const currentCount = navigationCountRef.current;

    // Increase full-screen ad frequency for non-pro users while navigating from home.
    if (currentCount % 4 === 0 && isRewardedLoaded) {
      showRewardedInterstitialAd();
      return;
    }

    if (currentCount % 2 === 0 && isLoaded) {
      showAd();
    }
  }, [isLoaded, isRewardedLoaded, showAd, showRewardedInterstitialAd]);

  return {
    handleMenuItemPress,
  };
};
