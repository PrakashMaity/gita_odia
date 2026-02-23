import {
  createRewardedInterstitialAd,
  setupRewardedInterstitialListeners,
  showRewardedInterstitialAd,
} from '@/components/ads';
import { useProStatus } from '@/hooks/useProStatus';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage rewarded interstitial ad lifecycle.
 */
export const useRewardedInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { isPro } = useProStatus();
  const rewardedInterstitialRef = useRef<any>(null);

  useEffect(() => {
    // If user is Pro, don't initialize ads
    if (isPro) {
      setIsInitialized(false);
      return;
    }

    const checkInitialization = () => {
      const initialized = isAdsInitialized();
      setIsInitialized(initialized);
      if (!initialized) {
        setTimeout(checkInitialization, 1000);
      }
    };
    checkInitialization();
  }, [isPro]);

  useEffect(() => {
    // Wait for SDK initialization before creating ad
    if (!isInitialized || isPro) {
      return;
    }

    const rewardedInterstitial = createRewardedInterstitialAd();
    rewardedInterstitialRef.current = rewardedInterstitial;

    const cleanup = setupRewardedInterstitialListeners(rewardedInterstitial, {
      onLoaded: () => {
        setIsLoaded(true);
      },
      onClosed: () => {
        setIsLoaded(false);
        setTimeout(() => {
          if (!isPro) rewardedInterstitial.load();
        }, 1000);
      },
      onError: () => {
        setIsLoaded(false);
        setTimeout(() => {
          if (!isPro && rewardedInterstitial) rewardedInterstitial.load();
        }, 30000);
      },
    });

    rewardedInterstitial.load();

    return () => {
      cleanup();
    };
  }, [isInitialized, isPro]);

  const showAd = async () => {
    if (isPro) {
      console.log('[useRewardedInterstitialAd] Ad suppressed for Pro user');
      return;
    }

    if (rewardedInterstitialRef.current && isLoaded) {
      await showRewardedInterstitialAd(rewardedInterstitialRef.current);
      setIsLoaded(false);
    }
  };

  return {
    isLoaded: isPro ? false : isLoaded,
    showAd,
  };
};
