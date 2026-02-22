import {
  createRewardedInterstitialAd,
  setupRewardedInterstitialListeners,
  showRewardedInterstitialAd,
} from '@/components/ads';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage rewarded interstitial ad lifecycle.
 */
export const useRewardedInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const rewardedInterstitialRef = useRef<any>(null);

  useEffect(() => {
    const checkInitialization = () => {
      const initialized = isAdsInitialized();
      setIsInitialized(initialized);
      if (!initialized) {
        setTimeout(checkInitialization, 1000);
      }
    };
    checkInitialization();
  }, []);

  useEffect(() => {
    if (!isInitialized) {
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
          rewardedInterstitial.load();
        }, 1000);
      },
      onError: () => {
        setIsLoaded(false);
        setTimeout(() => {
          rewardedInterstitial.load();
        }, 30000);
      },
    });

    rewardedInterstitial.load();

    return () => {
      cleanup();
    };
  }, [isInitialized]);

  const showAd = async () => {
    if (rewardedInterstitialRef.current && isLoaded) {
      await showRewardedInterstitialAd(rewardedInterstitialRef.current);
      setIsLoaded(false);
    }
  };

  return {
    isLoaded,
    showAd,
  };
};
