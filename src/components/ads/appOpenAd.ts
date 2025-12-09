import { shouldShowAds } from '@/services/adFreeService';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import Constants from 'expo-constants';
import { AdEventType, AppOpenAd } from 'react-native-google-mobile-ads';

// Get App Open Ad Unit ID from Expo Constants (app.config.js extra section)
// Always uses production ad unit ID
// Note: APP_OPEN_AD_UNIT_ID is optional - app open ads will only work if configured
const getAppOpenAdUnitId = (): string | null => {
  const adUnitId = Constants.expoConfig?.extra?.APP_OPEN_AD_UNIT_ID as string | undefined;
  
  if (!adUnitId) {
    console.warn('[AppOpenAd] APP_OPEN_AD_UNIT_ID not found in Expo Constants. App open ads will not be available.');
    return null;
  }
  
  return adUnitId;
};

const APP_OPEN_AD_UNIT_ID = getAppOpenAdUnitId();

/**
 * Creates and loads an app open ad
 * Following official react-native-google-mobile-ads documentation
 * Returns null if APP_OPEN_AD_UNIT_ID is not configured
 * Refactored to check SDK initialization before creating ad
 */
export const createAppOpenAd = (): AppOpenAd | null => {
  if (!APP_OPEN_AD_UNIT_ID) {
    console.warn('[AppOpenAd] Cannot create app open ad: APP_OPEN_AD_UNIT_ID not configured');
    return null;
  }

  if (!isAdsInitialized()) {
    console.warn('[AppOpenAd] SDK not initialized, ad creation may fail');
  }

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
 * @param appOpenAd - The app open ad instance
 * @param force - If true, bypasses all checks (for developer testing)
 */
export const showAppOpenAd = async (appOpenAd: AppOpenAd, force: boolean = false) => {
  try {
    if (!isAdsInitialized() && !force) {
      console.warn('[AppOpenAd] SDK not initialized, cannot show ad');
      return;
    }

    if (!force) {
      const shouldShow = await shouldShowAds();
      if (!shouldShow) {
        console.log('[AppOpenAd] Ads disabled, not showing');
        return;
      }
    }

    // Check if ad is loaded before showing (if property exists)
    // Note: The show() method will handle errors if ad is not loaded
    const adLoaded = (appOpenAd as any).loaded;
    if (adLoaded !== undefined && !adLoaded && !force) {
      console.warn('[AppOpenAd] Ad not loaded yet, cannot show');
      return;
    }

    appOpenAd.show();
    console.log('[AppOpenAd] Ad shown successfully');
  } catch (error) {
    console.error('[AppOpenAd] Error showing ad:', error);
  }
};

