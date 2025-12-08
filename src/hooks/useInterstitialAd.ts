import { createInterstitialAd, setupInterstitialListeners, showInterstitialAd } from '@/components/ads';
import { useEffect, useRef, useState } from 'react';

/**
 * Hook to manage interstitial ad lifecycle
 * Creates, loads, and manages showing interstitial ads
 */
export const useInterstitialAd = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const interstitialRef = useRef<any>(null);

  useEffect(() => {
    // Create and load the ad
    const interstitial = createInterstitialAd();
    interstitialRef.current = interstitial;

    // Set up listeners
    const cleanup = setupInterstitialListeners(interstitial, {
      onLoaded: () => {
        setIsLoaded(true);
      },
      onClosed: () => {
        // Reload ad after closing
        setIsLoaded(false);
        interstitial.load();
      },
      onError: (error) => {
        console.warn('Interstitial ad error:', error);
        setIsLoaded(false);
        // Retry loading after a delay
        setTimeout(() => {
          interstitial.load();
        }, 30000); // Retry after 30 seconds
      },
    });

    // Initial load
    interstitial.load();

    return () => {
      cleanup();
    };
  }, []);

  const showAd = async () => {
    if (interstitialRef.current && isLoaded) {
      await showInterstitialAd(interstitialRef.current);
      setIsLoaded(false); // Mark as not loaded after showing
    }
  };

  return {
    isLoaded,
    showAd,
  };
};
