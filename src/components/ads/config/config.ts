import Constants from "expo-constants";

// Get ad unit IDs from Expo Constants (app.config.js extra section)
// Always uses production ad unit IDs, never test IDs
const getAdUnitId = (key: string): string => {
  try {
    const extra = Constants.expoConfig?.extra || {};
    const adUnitId = extra[key] as string | undefined;
    
    if (!adUnitId) {
      console.error(`[AdConfig] Ad unit ID for ${key} not found in Expo Constants.`);
      console.error(`[AdConfig] Available keys in extra:`, Object.keys(extra));
      console.error(`[AdConfig] Please configure ${key} in app.config.js`);
      throw new Error(`Missing ad unit ID: ${key}`);
    }
    
    console.log(`[AdConfig] Loaded ad unit ID for ${key}: ${adUnitId.substring(0, 30)}...`);
    return adUnitId;
  } catch (error) {
    console.error(`[AdConfig] Error loading ad unit ID for ${key}:`, error);
    throw error;
  }
};

// Ad unit IDs from Expo Constants (always uses production IDs)
const INTERSTITIAL_AD_UNIT_ID = getAdUnitId('INTERSTITIAL_AD_UNIT_ID');
const REWARDED_AD_UNIT_ID = getAdUnitId('REWARDED_AD_UNIT_ID');
const REWARDED_INTERSTITIAL_AD_UNIT_ID = getAdUnitId('REWARDED_INTERSTITIAL_AD_UNIT_ID');

export { INTERSTITIAL_AD_UNIT_ID, REWARDED_AD_UNIT_ID, REWARDED_INTERSTITIAL_AD_UNIT_ID };
