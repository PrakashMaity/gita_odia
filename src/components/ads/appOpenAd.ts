import { AppOpenAd, AdEventType } from 'react-native-google-mobile-ads';
import { TestIds } from 'react-native-google-mobile-ads';
import Constants from 'expo-constants';
import { shouldShowAds } from '@/services/adFreeService';

// Get App Open Ad Unit ID from Expo Constants (app.config.js extra section)
// Note: Add APP_OPEN_AD_UNIT_ID to app.config.js extra section when available
const getAppOpenAdUnitId = (): string => {
  if (__DEV__) {
    return TestIds.APP_OPEN;
  }
  
  const adUnitId = Constants.expoConfig?.extra?.APP_OPEN_AD_UNIT_ID as string | undefined;
  
  if (!adUnitId) {
    console.warn('APP_OPEN_AD_UNIT_ID not found in Expo Constants. Using test ID.');
    return TestIds.APP_OPEN;
  }
  
  return adUnitId;
};

const APP_OPEN_AD_UNIT_ID = getAppOpenAdUnitId();

/**
 * Creates and loads an app open ad
 * Following official react-native-google-mobile-ads documentation
 */
export const createAppOpenAd = () => {
  const appOpenAd = AppOpenAd.createForAdRequest(APP_OPEN_AD_UNIT_ID, {
    keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
  });

  return appOpenAd;
};

/**
 * Sets up event listeners for an app open ad
 * Returns cleanup function to unsubscribe from events
 */
export const setupAppOpenListeners = (
  appOpenAd: AppOpenAd,
  callbacks?: {
    onLoaded?: () => void;
    onOpened?: () => void;
    onClosed?: () => void;
    onError?: (error: any) => void;
  }
) => {
  const unsubscribeLoaded = appOpenAd.addAdEventListener(AdEventType.LOADED, () => {
    callbacks?.onLoaded?.();
  });

  const unsubscribeOpened = appOpenAd.addAdEventListener(AdEventType.OPENED, () => {
    callbacks?.onOpened?.();
  });

  const unsubscribeClosed = appOpenAd.addAdEventListener(AdEventType.CLOSED, () => {
    callbacks?.onClosed?.();
  });

  const unsubscribeError = appOpenAd.addAdEventListener(AdEventType.ERROR, (error) => {
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
 * Shows an app open ad if it's loaded and ad-free is not active
 */
export const showAppOpenAd = async (appOpenAd: AppOpenAd) => {
  try {
    const shouldShow = await shouldShowAds();
    if (!shouldShow) {
      console.log('Ad-free active: skipping app open ad');
      return;
    }
    appOpenAd.show();
  } catch (error) {
    console.log('Error showing app open ad:', error);
  }
};

