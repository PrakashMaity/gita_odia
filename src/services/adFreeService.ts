import { useSettingsStore } from '@/store/settingsStore';
import { getRedeemData, getRemainingAdFreeTime, isAdFreeActive } from './shareAnalyticsService';

/**
 * Check if ads should be shown
 * Returns true if ads should be shown, false if ad-free is active or developer mode is enabled
 */
export async function shouldShowAds(): Promise<boolean> {
  // Check developer mode first (if enabled, disable ads)
  const developerMode = useSettingsStore.getState().settings.developerMode;
  if (developerMode) {
    return false;
  }
  
  // Check ad-free status
  const isAdFree = await isAdFreeActive();
  return !isAdFree;
}

/**
 * Check if ads should be shown (synchronous version)
 * Use this when you need a synchronous check without async operations
 */
export function shouldShowAdsSync(): boolean {
  // Check developer mode first (if enabled, disable ads)
  const developerMode = useSettingsStore.getState().settings.developerMode;
  if (developerMode) {
    return false;
  }
  
  // For sync version, we can't check ad-free status, so we only check developer mode
  // For full check including ad-free, use shouldShowAds() async version
  return true;
}

/**
 * Get ad-free status information
 */
export async function getAdFreeStatus(): Promise<{
  isActive: boolean;
  remainingTime: number; // milliseconds
  remainingDays: number;
  remainingHours: number;
  adFreeUntil: number;
}> {
  const isActive = await isAdFreeActive();
  const remainingTime = await getRemainingAdFreeTime();
  const redeemData = await getRedeemData();

  const remainingDays = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
  const remainingHours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

  return {
    isActive,
    remainingTime,
    remainingDays,
    remainingHours,
    adFreeUntil: redeemData.adFreeUntil,
  };
}

