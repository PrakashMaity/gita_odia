import Constants from "expo-constants";
import { TestIds } from "react-native-google-mobile-ads";

// Get ad unit IDs from Expo Constants (app.config.js extra section)
const getAdUnitId = (key: string, testId: string): string => {
  if (__DEV__) {
    return testId;
  }
  
  const adUnitId = Constants.expoConfig?.extra?.[key] as string | undefined;
  
  if (!adUnitId) {
    console.warn(`Ad unit ID for ${key} not found in Expo Constants. Using test ID.`);
    return testId;
  }
  
  return adUnitId;
};

// Ad unit IDs from Expo Constants
const BANNER_AD_UNIT_ID = getAdUnitId('BANNER_AD_UNIT_ID', TestIds.BANNER);
const INTERSTITIAL_AD_UNIT_ID = getAdUnitId('INTERSTITIAL_AD_UNIT_ID', TestIds.INTERSTITIAL);
const REWARDED_AD_UNIT_ID = getAdUnitId('REWARDED_AD_UNIT_ID', TestIds.REWARDED);
const REWARDED_INTERSTITIAL_AD_UNIT_ID = getAdUnitId('REWARDED_INTERSTITIAL_AD_UNIT_ID', TestIds.REWARDED_INTERSTITIAL);

export { BANNER_AD_UNIT_ID, INTERSTITIAL_AD_UNIT_ID, REWARDED_AD_UNIT_ID, REWARDED_INTERSTITIAL_AD_UNIT_ID };
