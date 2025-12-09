import { createInterstitialAd, setupInterstitialListeners, showInterstitialAd } from '@/components/ads';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage interstitial ad lifecycle
 * Creates, loads, and manages showing interstitial ads
 * Refactored to check SDK initialization before creating/loading ads
 */
export const useInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const interstitialRef = useRef<any>(null);

  // Check SDK initialization
  useEffect(() => {
    const checkInitialization = () => {
      const initialized = isAdsInitialized();
      setIsInitialized(initialized);
      if (!initialized) {
        // Retry after a short delay
        setTimeout(checkInitialization, 1000);
      }
    };
    checkInitialization();
  }, []);

  useEffect(() => {
    // Wait for SDK initialization before creating ad
    if (!isInitialized) {
      return;
    }

    // Create and load the ad
    const interstitial = createInterstitialAd();
    interstitialRef.current = interstitial;

    // Set up listeners
    const cleanup = setupInterstitialListeners(interstitial, {
      onLoaded: () => {
        setIsLoaded(true);
        console.log('[useInterstitialAd] Ad loaded successfully');
      },
      onClosed: () => {
        // Reload ad after closing
        setIsLoaded(false);
        console.log('[useInterstitialAd] Ad closed, reloading...');
        setTimeout(() => {
          interstitial.load();
        }, 1000);
      },
      onError: (error) => {
        console.warn('[useInterstitialAd] Ad error:', error);
        setIsLoaded(false);
        // Retry loading after a delay
        setTimeout(() => {
          interstitial.load();
        }, 30000); // Retry after 30 seconds
      },
    });

    // Initial load
    console.log('[useInterstitialAd] Loading ad...');
    interstitial.load();

    return () => {
      cleanup();
    };
  }, [isInitialized]);

  const showAd = async () => {
    if (interstitialRef.current && isLoaded) {
      await showInterstitialAd(interstitialRef.current);
      setIsLoaded(false); // Mark as not loaded after showing
    } else {
      console.warn('[useInterstitialAd] Ad not ready to show', { isLoaded, hasRef: !!interstitialRef.current });
    }
  };

  return {
    isLoaded,
    showAd,
  };
};
