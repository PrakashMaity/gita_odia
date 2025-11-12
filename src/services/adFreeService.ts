import { isAdFreeActive, getRemainingAdFreeTime, getRedeemData } from './shareAnalyticsService';

/**
 * Check if ads should be shown
 * Returns true if ads should be shown, false if ad-free is active
 */
export async function shouldShowAds(): Promise<boolean> {
  const isAdFree = await isAdFreeActive();
  return !isAdFree;
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

