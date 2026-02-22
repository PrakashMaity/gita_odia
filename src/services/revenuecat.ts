import { Platform } from 'react-native';
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

let initialized = false;

const REVENUECAT_API_KEYS = {
  android: __DEV__
    ? 'test_FBQtPMQntYcFvZHIQATXQUBRPDW' : 'goog_pJDbZEpNaWXfRLUADBqEJbBJpDs',
  ios: __DEV__
    ? 'test_FBQtPMQntYcFvZHIQATXQUBRPDW'
    : 'test_FBQtPMQntYcFvZHIQATXQUBRPDW',
};

const getApiKey = () => (Platform.OS === 'android'
  ? REVENUECAT_API_KEYS.android
  : REVENUECAT_API_KEYS.ios);

export const initializeRevenueCat = (): boolean => {
  if (initialized) return true;

  try {
    Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    Purchases.configure({ apiKey: getApiKey() });
    initialized = true;
    return true;
  } catch (error) {
    console.error('RevenueCat initialization failed:', error);
    return false;
  }
};
