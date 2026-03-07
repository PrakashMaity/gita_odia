import { MobileAds } from 'react-native-google-mobile-ads';

let _initialized = false;

/**
 * Initialize Google Mobile Ads SDK.
 * This must be called before using any ad components.
 *
 * NOTE: For the new centralized flow, prefer `AdsManager.getInstance().initialize()`
 * which calls this internally and also handles consent, test devices, and preloading.
 */
export const initializeAds = async (): Promise<void> => {
  if (_initialized) {
    console.log('[initializeAds] Already initialized, skipping');
    return;
  }

  try {
    // Configure test devices in development
    if (__DEV__) {
      await MobileAds().setRequestConfiguration({
        testDeviceIdentifiers: ['EMULATOR'],
      });
      console.log('[initializeAds] Test device configuration set');
    }

    await MobileAds().initialize();
    _initialized = true;
    console.log('[initializeAds] Google Mobile Ads initialized successfully');
  } catch (error) {
    console.error('[initializeAds] Error initializing Google Mobile Ads:', error);
    throw error;
  }
};

/**
 * Check if ads SDK is initialized.
 */
export const isAdsInitialized = (): boolean => {
  return _initialized;
};
