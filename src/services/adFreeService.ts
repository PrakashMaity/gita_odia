import { useSettingsStore } from '@/store/settingsStore';
import { isProActive } from './proService';
import { revenueCatService } from './revenueCat/revenueCatService';
import { getRedeemData, getRemainingAdFreeTime, isAdFreeActive } from './shareAnalyticsService';

/**
 * Check if ads should be shown
 * Returns true if ads should be shown, false if ad-free is active, developer mode is enabled, or user has Pro status
 */
export async function shouldShowAds(): Promise<boolean> {
  try {
    // Check developer mode first (if enabled, disable ads)
    const developerMode = useSettingsStore.getState().settings.developerMode;
    if (developerMode) {
      console.log('[shouldShowAds] Ads disabled: Developer mode is enabled');
      return false;
    }
    
    // Check Pro status - if user has Pro (either RevenueCat or free Pro), disable ads
    try {
      // Check RevenueCat premium status
      const hasRevenueCatPro = await revenueCatService.isPremium();
      
      // Check free Pro status (1-day Pro)
      const hasFreePro = await isProActive();
      
      // If user has any Pro status, don't show ads
      if (hasRevenueCatPro || hasFreePro) {
        console.log('[shouldShowAds] Ads disabled: Pro status active', { hasRevenueCatPro, hasFreePro });
        return false;
      }
    } catch (error) {
      console.error('[shouldShowAds] Error checking Pro status:', error);
      // If there's an error checking Pro status, continue with other checks
    }
    
    // Check ad-free status
    const isAdFree = await isAdFreeActive();
    if (isAdFree) {
      console.log('[shouldShowAds] Ads disabled: Ad-free is active');
      return false;
    }
    
    console.log('[shouldShowAds] Ads enabled: All checks passed');
    return true;
  } catch (error) {
    console.error('[shouldShowAds] Unexpected error:', error);
    // Default to showing ads if there's an unexpected error
    return true;
  }
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

