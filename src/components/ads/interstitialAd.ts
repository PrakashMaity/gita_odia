import { Platform, StatusBar } from 'react-native';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_AD_UNIT_ID } from './config/config';
import { shouldShowAds } from '@/services/adFreeService';

/**
 * Creates and loads an interstitial ad
 * Following official react-native-google-mobile-ads documentation
 */
export const createInterstitialAd = () => {
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
 */
export const showInterstitialAd = async (interstitial: InterstitialAd) => {
  try {
    const shouldShow = await shouldShowAds();
    if (!shouldShow) {
      console.log('Ad-free active: skipping interstitial ad');
      return;
    }
    interstitial.show();
  } catch (error) {
    console.log('Error showing interstitial ad:', error);
  }
};

