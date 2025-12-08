import { MobileAds } from 'react-native-google-mobile-ads';

/**
 * Initialize Google Mobile Ads SDK
 * This must be called before using any ad components
 */
export const initializeAds = async (): Promise<void> => {
  try {
    await MobileAds().initialize();
    console.log('Google Mobile Ads initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Mobile Ads:', error);
    throw error;
  }
};

/**
 * Check if ads SDK is initialized
 */
export const isAdsInitialized = (): boolean => {
  try {
    // Try to access the ads instance - if it's initialized, this won't throw
    const ads = MobileAds();
    return ads !== null && ads !== undefined;
  } catch {
    return false;
  }
};
