import { MenuItem } from '@/constants/menuData';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useProStatus } from '@/hooks/useProStatus';
import { useRewardedInterstitialAd } from '@/hooks/useRewardedInterstitialAd';
import { useCallback, useRef, useState } from 'react';
import { getNavigationHandler } from '../navigationHandlers';

/**
 * Custom hook for home screen navigation
 * Follows Single Responsibility Principle - handles menu item navigation
 */
export const useHomeNavigation = () => {
  const { isPro } = useProStatus();
  const { showAd, isLoaded } = useInterstitialAd();
  const { showAd: showRewardedInterstitialAd, isLoaded: isRewardedLoaded } = useRewardedInterstitialAd();
  const navigationCountRef = useRef(0);

  const [isUpgradeModalVisible, setIsUpgradeModalVisible] = useState(false);
  const [lockedFeatureName, setLockedFeatureName] = useState<string | undefined>();

  const handleMenuItemPress = useCallback((item: MenuItem) => {
    // Intercept premium items for non-pro users
    if (item.isPremium && !isPro) {
      setLockedFeatureName(item.title);
      setIsUpgradeModalVisible(true);
      return;
    }

    const handler = getNavigationHandler(item);
    handler();

    navigationCountRef.current += 1;
    const currentCount = navigationCountRef.current;

    // Increase full-screen ad frequency for non-pro users while navigating from home.
    if (currentCount % 2 === 0 && isRewardedLoaded) {
      showRewardedInterstitialAd();
      return;
    }

    if (isLoaded) {
      showAd();
    }
  }, [isPro, isLoaded, isRewardedLoaded, showAd, showRewardedInterstitialAd]);

  const closeUpgradeModal = () => {
    setIsUpgradeModalVisible(false);
    setLockedFeatureName(undefined);
  };

  return {
    handleMenuItemPress,
    isUpgradeModalVisible,
    lockedFeatureName,
    closeUpgradeModal,
  };
};
