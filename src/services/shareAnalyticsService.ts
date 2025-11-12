import AsyncStorage from '@react-native-async-storage/async-storage';

const SHARES_STORAGE_KEY = 'gita_shares_data';
const APP_SHARES_STORAGE_KEY = 'gita_app_shares_data';
const REDEEMED_POINTS_KEY = 'gita_redeemed_points';
const AD_FREE_UNTIL_KEY = 'gita_ad_free_until';

export interface ShareData {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  shareType: 'text' | 'image';
  isTranslationOnly: boolean;
  timestamp: number;
}

export interface AppShareData {
  shareType: 'app';
  timestamp: number;
}

export interface ShareStatistics {
  today: number;
  week: number;
  month: number;
  total: number;
}

export interface PointsData {
  currentPoints: number;
  expiredPoints: number;
  totalEarned: number;
  pointsBreakdown: {
    verseShares: number;
    appShares: number;
  };
  windowStart: number;
  windowEnd: number;
  canRedeem: boolean; // true if >= 1000 points
}

export interface RedeemData {
  adFreeUntil: number; // Timestamp when ad-free expires
  totalRedeemedPoints: number; // Total points redeemed so far
  totalAdFreeDays: number; // Total ad-free days earned
}

const POINTS_PER_VERSE_SHARE = 2;
const POINTS_PER_APP_SHARE = 10;
const POINTS_WINDOW_DAYS = 10;
export const REDEEM_THRESHOLD = 1000; // Points needed to redeem
const POINTS_PER_AD_FREE_DAY = 100; // 100 points = 1 day ad-free

/**
 * Store share analytics data locally
 */
export async function storeShareAnalytics(data: Omit<ShareData, 'timestamp'>): Promise<void> {
  try {
    const shareData: ShareData = {
      ...data,
      timestamp: Date.now(),
    };

    const existingData = await AsyncStorage.getItem(SHARES_STORAGE_KEY);
    const shares: ShareData[] = existingData ? JSON.parse(existingData) : [];
    
    shares.push(shareData);
    
    // Keep only last 1000 shares to prevent storage bloat
    const trimmedShares = shares.slice(-1000);
    
    await AsyncStorage.setItem(SHARES_STORAGE_KEY, JSON.stringify(trimmedShares));
  } catch (error) {
    console.error('Error storing share analytics:', error);
  }
}

/**
 * Store app share analytics data locally
 */
export async function storeAppShareAnalytics(): Promise<void> {
  try {
    const shareData: AppShareData = {
      shareType: 'app',
      timestamp: Date.now(),
    };

    const existingData = await AsyncStorage.getItem(APP_SHARES_STORAGE_KEY);
    const shares: AppShareData[] = existingData ? JSON.parse(existingData) : [];
    
    shares.push(shareData);
    
    // Keep only last 1000 shares to prevent storage bloat
    const trimmedShares = shares.slice(-1000);
    
    await AsyncStorage.setItem(APP_SHARES_STORAGE_KEY, JSON.stringify(trimmedShares));
  } catch (error) {
    console.error('Error storing app share analytics:', error);
  }
}

/**
 * Get share statistics for current device
 */
export async function getShareStatistics(): Promise<ShareStatistics> {
  try {
    const sharesData = await AsyncStorage.getItem(SHARES_STORAGE_KEY);
    const shares: ShareData[] = sharesData ? JSON.parse(sharesData) : [];

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const timestamps = shares.map(share => share.timestamp);

    const today = timestamps.filter(timestamp => timestamp >= oneDayAgo).length;
    const week = timestamps.filter(timestamp => timestamp >= oneWeekAgo).length;
    const month = timestamps.filter(timestamp => timestamp >= oneMonthAgo).length;
    const total = timestamps.length;

    return { today, week, month, total };
  } catch (error) {
    console.error('Error getting share statistics:', error);
    return { today: 0, week: 0, month: 0, total: 0 };
  }
}

/**
 * Get app share statistics for current device
 */
export async function getAppShareStatistics(): Promise<ShareStatistics> {
  try {
    const sharesData = await AsyncStorage.getItem(APP_SHARES_STORAGE_KEY);
    const shares: AppShareData[] = sharesData ? JSON.parse(sharesData) : [];

    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    const timestamps = shares.map(share => share.timestamp);

    const today = timestamps.filter(timestamp => timestamp >= oneDayAgo).length;
    const week = timestamps.filter(timestamp => timestamp >= oneWeekAgo).length;
    const month = timestamps.filter(timestamp => timestamp >= oneMonthAgo).length;
    const total = timestamps.length;

    return { today, week, month, total };
  } catch (error) {
    console.error('Error getting app share statistics:', error);
    return { today: 0, week: 0, month: 0, total: 0 };
  }
}

/**
 * Get combined share statistics (verse/translation + app shares)
 */
export async function getCombinedShareStatistics(): Promise<{
  verseShares: ShareStatistics;
  appShares: ShareStatistics;
  total: ShareStatistics;
}> {
  const [verseShares, appShares] = await Promise.all([
    getShareStatistics(),
    getAppShareStatistics(),
  ]);

  const total = {
    today: verseShares.today + appShares.today,
    week: verseShares.week + appShares.week,
    month: verseShares.month + appShares.month,
    total: verseShares.total + appShares.total,
  };

  return { verseShares, appShares, total };
}

/**
 * Calculate points with 10-day rolling window (local storage only)
 */
export async function getPointsData(): Promise<PointsData> {
  try {
    const [verseSharesData, appSharesData, redeemedTimestampsData] = await Promise.all([
      AsyncStorage.getItem(SHARES_STORAGE_KEY),
      AsyncStorage.getItem(APP_SHARES_STORAGE_KEY),
      AsyncStorage.getItem('gita_redeemed_share_timestamps'),
    ]);

    const verseShares: ShareData[] = verseSharesData ? JSON.parse(verseSharesData) : [];
    const appShares: AppShareData[] = appSharesData ? JSON.parse(appSharesData) : [];
    const redeemedTimestamps: number[] = redeemedTimestampsData ? JSON.parse(redeemedTimestampsData) : [];

    const now = Date.now();
    const tenDaysAgo = now - POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const elevenDaysAgo = now - (POINTS_WINDOW_DAYS + 1) * 24 * 60 * 60 * 1000;

    // Process verse shares (exclude redeemed ones)
    const verseSharesWithPoints = verseShares
      .filter(share => !redeemedTimestamps.includes(share.timestamp))
      .map(share => ({
        timestamp: share.timestamp,
        points: POINTS_PER_VERSE_SHARE,
        type: 'verse' as const,
      }));

    // Process app shares (exclude redeemed ones)
    const appSharesWithPoints = appShares
      .filter(share => !redeemedTimestamps.includes(share.timestamp))
      .map(share => ({
        timestamp: share.timestamp,
        points: POINTS_PER_APP_SHARE,
        type: 'app' as const,
      }));

    // Combine all shares
    const allShares = [...verseSharesWithPoints, ...appSharesWithPoints];

    // Calculate points in the 10-day window (current points)
    const currentShares = allShares.filter(share => share.timestamp >= tenDaysAgo);
    const currentVerseShares = currentShares.filter(share => share.type === 'verse');
    const currentAppShares = currentShares.filter(share => share.type === 'app');

    const currentPoints = currentShares.reduce((sum, share) => sum + share.points, 0);

    // Calculate expired points (shares from 11 days ago that are now expired)
    const expiredShares = allShares.filter(share => 
      share.timestamp >= elevenDaysAgo && share.timestamp < tenDaysAgo
    );
    const expiredPoints = expiredShares.reduce((sum, share) => sum + share.points, 0);

    // Calculate total earned (all time)
    const totalEarned = allShares.reduce((sum, share) => sum + share.points, 0);

    // Calculate points breakdown
    const pointsBreakdown = {
      verseShares: currentVerseShares.reduce((sum, share) => sum + share.points, 0),
      appShares: currentAppShares.reduce((sum, share) => sum + share.points, 0),
    };

    return {
      currentPoints,
      expiredPoints,
      totalEarned,
      pointsBreakdown,
      windowStart: tenDaysAgo,
      windowEnd: now,
      canRedeem: currentPoints >= REDEEM_THRESHOLD,
    };
  } catch (error) {
    console.error('Error getting points data:', error);
    return {
      currentPoints: 0,
      expiredPoints: 0,
      totalEarned: 0,
      pointsBreakdown: { verseShares: 0, appShares: 0 },
      windowStart: Date.now(),
      windowEnd: Date.now() + POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000,
      canRedeem: false,
    };
  }
}

/**
 * Get redeem data (ad-free status)
 */
export async function getRedeemData(): Promise<RedeemData> {
  try {
    const adFreeUntilData = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
    const redeemedPointsData = await AsyncStorage.getItem(REDEEMED_POINTS_KEY);

    const adFreeUntil = adFreeUntilData ? parseInt(adFreeUntilData, 10) : 0;
    const redeemedHistory = redeemedPointsData ? JSON.parse(redeemedPointsData) : [];

    const totalRedeemedPoints = redeemedHistory.reduce((sum: number, entry: { points: number }) => sum + entry.points, 0);
    const totalAdFreeDays = Math.floor(totalRedeemedPoints / POINTS_PER_AD_FREE_DAY);

    return {
      adFreeUntil,
      totalRedeemedPoints,
      totalAdFreeDays,
    };
  } catch (error) {
    console.error('Error getting redeem data:', error);
    return {
      adFreeUntil: 0,
      totalRedeemedPoints: 0,
      totalAdFreeDays: 0,
    };
  }
}

/**
 * Check if ads should be disabled (ad-free active)
 */
export async function isAdFreeActive(): Promise<boolean> {
  try {
    const adFreeUntilData = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
    if (!adFreeUntilData) {
      return false;
    }

    const adFreeUntil = parseInt(adFreeUntilData, 10);
    return Date.now() < adFreeUntil;
  } catch (error) {
    console.error('Error checking ad-free status:', error);
    return false;
  }
}

/**
 * Redeem points for ad-free days
 * 100 points = 1 day ad-free
 * Minimum 1000 points required to redeem
 */
export async function redeemPoints(pointsToRedeem: number = REDEEM_THRESHOLD): Promise<{ success: boolean; adFreeDays: number; message: string }> {
  try {
    const pointsData = await getPointsData();
    
    if (pointsData.currentPoints < pointsToRedeem) {
      return {
        success: false,
        adFreeDays: 0,
        message: `Insufficient points. You need ${pointsToRedeem} points to redeem.`,
      };
    }

    if (pointsToRedeem < POINTS_PER_AD_FREE_DAY) {
      return {
        success: false,
        adFreeDays: 0,
        message: `Minimum ${POINTS_PER_AD_FREE_DAY} points required to redeem.`,
      };
    }

    // Calculate ad-free days
    const adFreeDays = Math.floor(pointsToRedeem / POINTS_PER_AD_FREE_DAY);
    const adFreeDuration = adFreeDays * 24 * 60 * 60 * 1000; // Convert days to milliseconds

    // Get current ad-free status
    const currentAdFreeUntil = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
    const currentAdFreeUntilTime = currentAdFreeUntil ? parseInt(currentAdFreeUntil, 10) : Date.now();
    
    // If already ad-free, extend from current expiry, otherwise start from now
    const newAdFreeUntil = currentAdFreeUntilTime > Date.now() 
      ? currentAdFreeUntilTime + adFreeDuration 
      : Date.now() + adFreeDuration;

    // Save new ad-free expiry
    await AsyncStorage.setItem(AD_FREE_UNTIL_KEY, newAdFreeUntil.toString());

    // Record redemption
    const redeemedHistoryData = await AsyncStorage.getItem(REDEEMED_POINTS_KEY);
    const redeemedHistory = redeemedHistoryData ? JSON.parse(redeemedHistoryData) : [];
    redeemedHistory.push({
      points: pointsToRedeem,
      adFreeDays,
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem(REDEEMED_POINTS_KEY, JSON.stringify(redeemedHistory));

    // Remove redeemed points from shares (mark as redeemed)
    // We'll track this by removing shares that contribute to the redeemed points
    await removeRedeemedPointsFromShares(pointsToRedeem);

    return {
      success: true,
      adFreeDays,
      message: `Successfully redeemed ${pointsToRedeem} points for ${adFreeDays} day(s) of ad-free experience!`,
    };
  } catch (error) {
    console.error('Error redeeming points:', error);
    return {
      success: false,
      adFreeDays: 0,
      message: 'Error redeeming points. Please try again.',
    };
  }
}

/**
 * Remove redeemed points from shares (to prevent double redemption)
 */
async function removeRedeemedPointsFromShares(pointsToRedeem: number): Promise<void> {
  try {
    const [verseSharesData, appSharesData] = await Promise.all([
      AsyncStorage.getItem(SHARES_STORAGE_KEY),
      AsyncStorage.getItem(APP_SHARES_STORAGE_KEY),
    ]);

    const verseShares: ShareData[] = verseSharesData ? JSON.parse(verseSharesData) : [];
    const appShares: AppShareData[] = appSharesData ? JSON.parse(appSharesData) : [];

    const now = Date.now();
    const tenDaysAgo = now - POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000;

    // Get current window shares sorted by timestamp (oldest first)
    const currentVerseShares = verseShares
      .filter(share => share.timestamp >= tenDaysAgo)
      .sort((a, b) => a.timestamp - b.timestamp);
    
    const currentAppShares = appShares
      .filter(share => share.timestamp >= tenDaysAgo)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Remove shares starting from oldest until we've removed enough points
    let pointsRemoved = 0;
    const sharesToRemove: { type: 'verse' | 'app'; index: number }[] = [];

    // Remove verse shares first (worth less points)
    for (let i = 0; i < currentVerseShares.length && pointsRemoved < pointsToRedeem; i++) {
      sharesToRemove.push({ type: 'verse', index: i });
      pointsRemoved += POINTS_PER_VERSE_SHARE;
    }

    // If still need more points, remove app shares
    for (let i = 0; i < currentAppShares.length && pointsRemoved < pointsToRedeem; i++) {
      sharesToRemove.push({ type: 'app', index: i });
      pointsRemoved += POINTS_PER_APP_SHARE;
    }

    // Remove the shares (mark them as redeemed by removing from current window)
    // We'll keep them in storage but mark them as redeemed by storing redeemed timestamps
    const redeemedTimestampsKey = 'gita_redeemed_share_timestamps';
    const redeemedTimestampsData = await AsyncStorage.getItem(redeemedTimestampsKey);
    const redeemedTimestamps: number[] = redeemedTimestampsData ? JSON.parse(redeemedTimestampsData) : [];

    sharesToRemove.forEach(({ type, index }) => {
      const share = type === 'verse' ? currentVerseShares[index] : currentAppShares[index];
      if (share && !redeemedTimestamps.includes(share.timestamp)) {
        redeemedTimestamps.push(share.timestamp);
      }
    });

    await AsyncStorage.setItem(redeemedTimestampsKey, JSON.stringify(redeemedTimestamps));
  } catch (error) {
    console.error('Error removing redeemed points from shares:', error);
  }
}

/**
 * Get remaining ad-free time in milliseconds
 */
export async function getRemainingAdFreeTime(): Promise<number> {
  try {
    const adFreeUntilData = await AsyncStorage.getItem(AD_FREE_UNTIL_KEY);
    if (!adFreeUntilData) {
      return 0;
    }

    const adFreeUntil = parseInt(adFreeUntilData, 10);
    const remaining = adFreeUntil - Date.now();
    return remaining > 0 ? remaining : 0;
  } catch (error) {
    console.error('Error getting remaining ad-free time:', error);
    return 0;
  }
}
