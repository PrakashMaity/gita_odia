import Constants from 'expo-constants';

// ─── Types ───────────────────────────────────────────────────────────────────

interface AdUnitIds {
  interstitial: string;
  rewarded: string;
  rewardedInterstitial: string;
  appOpen: string | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Get an ad unit ID from Expo Constants (app.config.js → extra).
 * Returns null if the key is not configured (optional ad units like app open).
 */
const getAdUnitId = (key: string, required = true): string | null => {
  try {
    const extra = Constants.expoConfig?.extra || {};
    const adUnitId = extra[key] as string | undefined;

    if (!adUnitId) {
      if (required) {
        console.error(`[AdConfig] Ad unit ID for ${key} not found in Expo Constants.`);
        console.error(`[AdConfig] Available keys in extra:`, Object.keys(extra));
        console.error(`[AdConfig] Please configure ${key} in app.config.js`);
        throw new Error(`Missing ad unit ID: ${key}`);
      }
      return null;
    }

    console.log(`[AdConfig] Loaded ad unit ID for ${key}: ${adUnitId.substring(0, 30)}...`);
    return adUnitId;
  } catch (error) {
    if (required) {
      console.error(`[AdConfig] Error loading ad unit ID for ${key}:`, error);
      throw error;
    }
    return null;
  }
};

// ─── Exports ─────────────────────────────────────────────────────────────────

// Individual exports (backwards compatible)
const INTERSTITIAL_AD_UNIT_ID = getAdUnitId('INTERSTITIAL_AD_UNIT_ID')!;
const REWARDED_AD_UNIT_ID = getAdUnitId('REWARDED_AD_UNIT_ID')!;
const REWARDED_INTERSTITIAL_AD_UNIT_ID = getAdUnitId('REWARDED_INTERSTITIAL_AD_UNIT_ID')!;

export { INTERSTITIAL_AD_UNIT_ID, REWARDED_AD_UNIT_ID, REWARDED_INTERSTITIAL_AD_UNIT_ID };

/**
 * Get all ad unit IDs as a single object.
 * Used by AdsManager for centralized access.
 */
export const getAdUnitIds = (): AdUnitIds => ({
  interstitial: INTERSTITIAL_AD_UNIT_ID,
  rewarded: REWARDED_AD_UNIT_ID,
  rewardedInterstitial: REWARDED_INTERSTITIAL_AD_UNIT_ID,
  appOpen: getAdUnitId('APP_OPEN_AD_UNIT_ID', false),
});
