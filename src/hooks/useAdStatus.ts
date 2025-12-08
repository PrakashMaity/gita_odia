import { getAdFreeStatus, shouldShowAds } from '@/services/adFreeService';
import { useSettingsStore } from '@/store/settingsStore';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { MobileAds } from 'react-native-google-mobile-ads';

export interface AdStatus {
  isInitialized: boolean;
  isEnabled: boolean; // Not blocked by developer mode or ad-free
  developerMode: boolean;
  adFreeActive: boolean;
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
}

/**
 * Hook to get current ad status for debugging and settings display
 */
export const useAdStatus = (): AdStatus => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [adFreeActive, setAdFreeActive] = useState(false);
  const { settings } = useSettingsStore();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if ads SDK is initialized
        const ads = MobileAds();
        setIsInitialized(ads !== null && ads !== undefined);
      } catch {
        setIsInitialized(false);
      }

      // Check if ads should be shown
      const shouldShow = await shouldShowAds();
      setIsEnabled(shouldShow);

      // Check ad-free status
      try {
        const adFreeStatus = await getAdFreeStatus();
        setAdFreeActive(adFreeStatus.isActive);
      } catch {
        setAdFreeActive(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [settings.developerMode]);

  return {
    isInitialized,
    isEnabled,
    developerMode: settings.developerMode,
    adFreeActive,
    bannerAdUnitId: Constants.expoConfig?.extra?.BANNER_AD_UNIT_ID as string || 'Test Banner',
    interstitialAdUnitId: Constants.expoConfig?.extra?.INTERSTITIAL_AD_UNIT_ID as string || 'Test Interstitial',
  };
};
