import { createInterstitialAd, setupInterstitialListeners } from '@/components/ads/interstitialAd';
import { createRewardedAd, setupRewardedListeners } from '@/components/ads/rewardedAd';
import { createRewardedInterstitialAd, setupRewardedInterstitialListeners } from '@/components/ads/rewardedInterstitialAd';
import { getAdFreeStatus, shouldShowAds } from '@/services/adFreeService';
import { useSettingsStore } from '@/store/settingsStore';
import { useEffect, useRef, useState } from 'react';
import { MobileAds } from 'react-native-google-mobile-ads';

export interface AdStatus {
  isInitialized: boolean;
  isEnabled: boolean; // Not blocked by developer mode or ad-free
  developerMode: boolean;
  adFreeActive: boolean;
  bannerAdActive: boolean; // Banner ads are active if enabled (they auto-load when component mounts)
  interstitialAdLoaded: boolean;
  rewardedAdLoaded: boolean;
  rewardedInterstitialAdLoaded: boolean;
}

/**
 * Hook to get current ad status for debugging and settings display
 */
export const useAdStatus = (): AdStatus => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [adFreeActive, setAdFreeActive] = useState(false);
  const [bannerAdActive, setBannerAdActive] = useState(false);
  const [interstitialAdLoaded, setInterstitialAdLoaded] = useState(false);
  const [rewardedAdLoaded, setRewardedAdLoaded] = useState(false);
  const [rewardedInterstitialAdLoaded, setRewardedInterstitialAdLoaded] = useState(false);
  
  const { settings } = useSettingsStore();
  const interstitialRef = useRef<any>(null);
  const rewardedRef = useRef<any>(null);
  const rewardedInterstitialRef = useRef<any>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        // Check if ads SDK is initialized
        const ads = MobileAds();
        const initialized = ads !== null && ads !== undefined;
        setIsInitialized(initialized);
        
        if (!initialized) {
          setIsEnabled(false);
          setBannerAdActive(false);
          return;
        }
      } catch {
        setIsInitialized(false);
        setIsEnabled(false);
        setBannerAdActive(false);
        return;
      }

      // Check if ads should be shown
      const shouldShow = await shouldShowAds();
      setIsEnabled(shouldShow);
      setBannerAdActive(shouldShow); // Banner ads are active if ads are enabled

      // Check ad-free status
      try {
        const adFreeStatus = await getAdFreeStatus();
        setAdFreeActive(adFreeStatus.isActive);
      } catch {
        setAdFreeActive(false);
      }
    };

    checkStatus();
    // Check less frequently to reduce overhead
    const interval = setInterval(checkStatus, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [settings.developerMode]);

  // Track interstitial ad loaded status
  useEffect(() => {
    if (!isEnabled || !isInitialized) {
      setInterstitialAdLoaded(false);
      return;
    }

    try {
      const interstitial = createInterstitialAd();
      interstitialRef.current = interstitial;

      const cleanup = setupInterstitialListeners(interstitial, {
        onLoaded: () => {
          setInterstitialAdLoaded(true);
          console.log('[useAdStatus] Interstitial ad loaded');
        },
        onClosed: () => {
          setInterstitialAdLoaded(false);
          // Reload ad after closing
          setTimeout(() => {
            interstitial.load();
          }, 1000);
        },
        onError: (error) => {
          console.warn('[useAdStatus] Interstitial ad error:', error);
          setInterstitialAdLoaded(false);
        },
      });

      // Initial load
      interstitial.load();

      return () => {
        cleanup();
      };
    } catch (error) {
      console.error('[useAdStatus] Error setting up interstitial ad tracking:', error);
      setInterstitialAdLoaded(false);
    }
  }, [isEnabled, isInitialized]);

  // Track rewarded ad loaded status
  useEffect(() => {
    if (!isEnabled || !isInitialized) {
      setRewardedAdLoaded(false);
      return;
    }

    try {
      const rewarded = createRewardedAd();
      rewardedRef.current = rewarded;

      const cleanup = setupRewardedListeners(rewarded, {
        onLoaded: () => {
          setRewardedAdLoaded(true);
          console.log('[useAdStatus] Rewarded ad loaded');
        },
        onClosed: () => {
          setRewardedAdLoaded(false);
          // Reload ad after closing
          setTimeout(() => {
            rewarded.load();
          }, 1000);
        },
        onError: (error) => {
          console.warn('[useAdStatus] Rewarded ad error:', error);
          setRewardedAdLoaded(false);
        },
      });

      // Initial load
      rewarded.load();

      return () => {
        cleanup();
      };
    } catch (error) {
      console.error('[useAdStatus] Error setting up rewarded ad tracking:', error);
      setRewardedAdLoaded(false);
    }
  }, [isEnabled, isInitialized]);

  // Track rewarded interstitial ad loaded status
  useEffect(() => {
    if (!isEnabled || !isInitialized) {
      setRewardedInterstitialAdLoaded(false);
      return;
    }

    try {
      const rewardedInterstitial = createRewardedInterstitialAd();
      rewardedInterstitialRef.current = rewardedInterstitial;

      const cleanup = setupRewardedInterstitialListeners(rewardedInterstitial, {
        onLoaded: () => {
          setRewardedInterstitialAdLoaded(true);
          console.log('[useAdStatus] Rewarded interstitial ad loaded');
        },
        onClosed: () => {
          setRewardedInterstitialAdLoaded(false);
          // Reload ad after closing
          setTimeout(() => {
            rewardedInterstitial.load();
          }, 1000);
        },
        onError: (error) => {
          console.warn('[useAdStatus] Rewarded interstitial ad error:', error);
          setRewardedInterstitialAdLoaded(false);
        },
      });

      // Initial load
      rewardedInterstitial.load();

      return () => {
        cleanup();
      };
    } catch (error) {
      console.error('[useAdStatus] Error setting up rewarded interstitial ad tracking:', error);
      setRewardedInterstitialAdLoaded(false);
    }
  }, [isEnabled, isInitialized]);

  return {
    isInitialized,
    isEnabled,
    developerMode: settings.developerMode,
    adFreeActive,
    bannerAdActive,
    interstitialAdLoaded,
    rewardedAdLoaded,
    rewardedInterstitialAdLoaded,
  };
};
