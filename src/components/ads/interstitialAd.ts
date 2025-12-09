import { shouldShowAds } from '@/services/adFreeService';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import { Platform, StatusBar } from 'react-native';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_AD_UNIT_ID } from './config/config';

/**
 * Creates and loads an interstitial ad
 * Following official react-native-google-mobile-ads documentation
 * Refactored to check SDK initialization before creating ad
 */
export const createInterstitialAd = () => {
  if (!isAdsInitialized()) {
    console.warn('[InterstitialAd] SDK not initialized, ad creation may fail');
  }

  const interstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
    keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
  });

  return interstitial;
};

/**
 * Sets up event listeners for an interstitial ad
 * Returns cleanup function to unsubscribe from events
 */
export const setupInterstitialListeners = (
  interstitial: InterstitialAd,
  callbacks?: {
    onLoaded?: () => void;
    onOpened?: () => void;
    onClosed?: () => void;
    onError?: (error: any) => void;
  }
) => {
  const unsubscribeLoaded = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    callbacks?.onLoaded?.();
  });

  const unsubscribeOpened = interstitial.addAdEventListener(AdEventType.OPENED, () => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(true);
    }
    callbacks?.onOpened?.();
  });

  const unsubscribeClosed = interstitial.addAdEventListener(AdEventType.CLOSED, () => {
    if (Platform.OS === 'ios') {
      StatusBar.setHidden(false);
    }
    callbacks?.onClosed?.();
  });

  const unsubscribeError = interstitial.addAdEventListener(AdEventType.ERROR, (error) => {
    callbacks?.onError?.(error);
  });

  return () => {
    unsubscribeLoaded();
    unsubscribeOpened();
    unsubscribeClosed();
    unsubscribeError();
  };
};

/**
 * Shows an interstitial ad if it's loaded and ad-free is not active
 * @param interstitial - The interstitial ad instance
 * @param force - If true, bypasses all checks (for developer testing)
 */
export const showInterstitialAd = async (interstitial: InterstitialAd, force: boolean = false) => {
  try {
    if (!isAdsInitialized() && !force) {
      console.warn('[InterstitialAd] SDK not initialized, cannot show ad');
      return;
    }

    if (!force) {
      const shouldShow = await shouldShowAds();
      if (!shouldShow) {
        console.log('[InterstitialAd] Ads disabled, not showing');
        return;
      }
    }

    // Check if ad is loaded before showing (if property exists)
    // Note: The show() method will handle errors if ad is not loaded
    const adLoaded = (interstitial as any).loaded;
    if (adLoaded !== undefined && !adLoaded && !force) {
      console.warn('[InterstitialAd] Ad not loaded yet, cannot show');
      return;
    }

    interstitial.show();
    console.log('[InterstitialAd] Ad shown successfully');
  } catch (error) {
    console.error('[InterstitialAd] Error showing ad:', error);
  }
};

