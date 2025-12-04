import Constants from 'expo-constants';

/**
 * Get RevenueCat API keys from Expo Constants (app.config.js extra section)
 */
const getRevenueCatApiKey = (platform: 'ios' | 'android'): string => {
  const key = platform === 'ios' 
    ? Constants.expoConfig?.extra?.REVENUECAT_IOS_API_KEY 
    : Constants.expoConfig?.extra?.REVENUECAT_ANDROID_API_KEY;
  
  const apiKey = key as string | undefined;
  
  if (!apiKey) {
    console.warn(`RevenueCat ${platform} API key not found in Expo Constants.`);
    // Fallback to test key - replace with your actual keys in app.config.js
    return 'test_FBQtPMQntYcFvZHIQATXQUBRPDW';
  }
  
  return apiKey;
};

export const REVENUECAT_CONFIG = {
  iosApiKey: getRevenueCatApiKey('ios'),
  androidApiKey: getRevenueCatApiKey('android'),
};

