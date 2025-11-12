import firestore from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

const DEVICE_ID_KEY = 'gita_device_id';
const SHARE_ANALYTICS_COLLECTION = 'ShareAnalytics';
const APP_SHARE_ANALYTICS_COLLECTION = 'AppShareAnalytics';
const PENDING_SHARES_KEY = 'gita_pending_shares';
const PENDING_APP_SHARES_KEY = 'gita_pending_app_shares';

export interface ShareAnalyticsData {
  deviceId: string;
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  shareType: 'text' | 'image';
  isTranslationOnly: boolean;
  timestamp: number;
  createdAt: number;
}

export interface AppShareAnalyticsData {
  deviceId: string;
  shareType: 'app';
  timestamp: number;
  createdAt: number;
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
  windowStart: number; // Timestamp of the start of the 10-day window
  windowEnd: number; // Timestamp of the end of the 10-day window
}

const POINTS_PER_VERSE_SHARE = 2;
const POINTS_PER_APP_SHARE = 10;
const POINTS_WINDOW_DAYS = 10;

/**
 * Get or create device ID
 */
async function getDeviceId(): Promise<string | null> {
  try {
    const deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    return deviceId;
  } catch (error) {
    console.error('Error getting device ID:', error);
    return null;
  }
}

/**
 * Store share analytics data in Firestore
 */
export async function storeShareAnalytics(data: Omit<ShareAnalyticsData, 'deviceId' | 'createdAt'>): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      // Store offline for later sync
      await saveShareDataOffline(data);
      return;
    }

    const app = getApp();
    if (!app) {
      await saveShareDataOffline(data);
      return;
    }

    const db = firestore();
    const analyticsData: ShareAnalyticsData = {
      deviceId,
      ...data,
      createdAt: Date.now(),
    };

    // Add to Firestore
    await db.collection(SHARE_ANALYTICS_COLLECTION).add(analyticsData);
    
    console.log('Share analytics stored successfully');
  } catch (error) {
    console.error('Error storing share analytics:', error);
    // Store offline for later sync
    await saveShareDataOffline(data);
  }
}

/**
 * Store app share analytics data in Firestore
 */
export async function storeAppShareAnalytics(): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      // Store offline for later sync
      await saveAppShareDataOffline();
      return;
    }

    const app = getApp();
    if (!app) {
      await saveAppShareDataOffline();
      return;
    }

    const db = firestore();
    const analyticsData: AppShareAnalyticsData = {
      deviceId,
      shareType: 'app',
      timestamp: Date.now(),
      createdAt: Date.now(),
    };

    // Add to Firestore
    await db.collection(APP_SHARE_ANALYTICS_COLLECTION).add(analyticsData);
    
    console.log('App share analytics stored successfully');
  } catch (error) {
    console.error('Error storing app share analytics:', error);
    // Store offline for later sync
    await saveAppShareDataOffline();
  }
}

/**
 * Save share data offline for later sync
 */
async function saveShareDataOffline(data: Omit<ShareAnalyticsData, 'deviceId' | 'createdAt'>): Promise<void> {
  try {
    const pendingData = await AsyncStorage.getItem(PENDING_SHARES_KEY);
    const pendingShares: Array<Omit<ShareAnalyticsData, 'deviceId' | 'createdAt'>> = pendingData 
      ? JSON.parse(pendingData) 
      : [];
    
    pendingShares.push(data);
    await AsyncStorage.setItem(PENDING_SHARES_KEY, JSON.stringify(pendingShares));
  } catch (error) {
    console.error('Error saving share data offline:', error);
  }
}

/**
 * Save app share data offline for later sync
 */
async function saveAppShareDataOffline(): Promise<void> {
  try {
    const pendingData = await AsyncStorage.getItem(PENDING_APP_SHARES_KEY);
    const pendingShares: Array<Omit<AppShareAnalyticsData, 'deviceId' | 'createdAt'>> = pendingData 
      ? JSON.parse(pendingData) 
      : [];
    
    pendingShares.push({
      shareType: 'app',
      timestamp: Date.now(),
    });
    await AsyncStorage.setItem(PENDING_APP_SHARES_KEY, JSON.stringify(pendingShares));
  } catch (error) {
    console.error('Error saving app share data offline:', error);
  }
}

/**
 * Sync pending share data to Firestore
 */
export async function syncPendingShareData(): Promise<void> {
  try {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      return;
    }

    const app = getApp();
    if (!app) {
      return;
    }

    const db = firestore();
    
    // Sync verse/translation shares
    const pendingSharesData = await AsyncStorage.getItem(PENDING_SHARES_KEY);
    if (pendingSharesData) {
      const pendingShares: Array<Omit<ShareAnalyticsData, 'deviceId' | 'createdAt'>> = JSON.parse(pendingSharesData);
      
      for (const shareData of pendingShares) {
        try {
          const analyticsData: ShareAnalyticsData = {
            deviceId,
            ...shareData,
            createdAt: shareData.timestamp || Date.now(),
          };
          await db.collection(SHARE_ANALYTICS_COLLECTION).add(analyticsData);
        } catch (error) {
          console.error('Error syncing pending share:', error);
        }
      }
      
      await AsyncStorage.removeItem(PENDING_SHARES_KEY);
    }

    // Sync app shares
    const pendingAppSharesData = await AsyncStorage.getItem(PENDING_APP_SHARES_KEY);
    if (pendingAppSharesData) {
      const pendingAppShares: Array<Omit<AppShareAnalyticsData, 'deviceId' | 'createdAt'>> = JSON.parse(pendingAppSharesData);
      
      for (const shareData of pendingAppShares) {
        try {
          const analyticsData: AppShareAnalyticsData = {
            deviceId,
            ...shareData,
            createdAt: shareData.timestamp || Date.now(),
          };
          await db.collection(APP_SHARE_ANALYTICS_COLLECTION).add(analyticsData);
        } catch (error) {
          console.error('Error syncing pending app share:', error);
        }
      }
      
      await AsyncStorage.removeItem(PENDING_APP_SHARES_KEY);
    }
  } catch (error) {
    console.error('Error syncing pending share data:', error);
  }
}

/**
 * Get share statistics for current device
 */
export async function getShareStatistics(): Promise<ShareStatistics> {
  try {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      return { today: 0, week: 0, month: 0, total: 0 };
    }

    const app = getApp();
    if (!app) {
      return { today: 0, week: 0, month: 0, total: 0 };
    }

    const db = firestore();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Get all shares for this device
    const sharesSnapshot = await db
      .collection(SHARE_ANALYTICS_COLLECTION)
      .where('deviceId', '==', deviceId)
      .get();

    const shares = sharesSnapshot.docs.map(doc => {
      const data = doc.data();
      return data.timestamp || data.createdAt;
    });

    // Calculate statistics
    const today = shares.filter(timestamp => timestamp >= oneDayAgo).length;
    const week = shares.filter(timestamp => timestamp >= oneWeekAgo).length;
    const month = shares.filter(timestamp => timestamp >= oneMonthAgo).length;
    const total = shares.length;

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
    const deviceId = await getDeviceId();
    if (!deviceId) {
      return { today: 0, week: 0, month: 0, total: 0 };
    }

    const app = getApp();
    if (!app) {
      return { today: 0, week: 0, month: 0, total: 0 };
    }

    const db = firestore();
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;

    // Get all app shares for this device
    const sharesSnapshot = await db
      .collection(APP_SHARE_ANALYTICS_COLLECTION)
      .where('deviceId', '==', deviceId)
      .get();

    const shares = sharesSnapshot.docs.map(doc => {
      const data = doc.data();
      return data.timestamp || data.createdAt;
    });

    // Calculate statistics
    const today = shares.filter(timestamp => timestamp >= oneDayAgo).length;
    const week = shares.filter(timestamp => timestamp >= oneWeekAgo).length;
    const month = shares.filter(timestamp => timestamp >= oneMonthAgo).length;
    const total = shares.length;

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
 * Calculate points with 10-day rolling window
 * Points expire after 10 days (on 11th day, 1st day points expire)
 */
export async function getPointsData(): Promise<PointsData> {
  try {
    const deviceId = await getDeviceId();
    if (!deviceId) {
      return {
        currentPoints: 0,
        expiredPoints: 0,
        totalEarned: 0,
        pointsBreakdown: { verseShares: 0, appShares: 0 },
        windowStart: Date.now(),
        windowEnd: Date.now() + POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000,
      };
    }

    const app = getApp();
    if (!app) {
      return {
        currentPoints: 0,
        expiredPoints: 0,
        totalEarned: 0,
        pointsBreakdown: { verseShares: 0, appShares: 0 },
        windowStart: Date.now(),
        windowEnd: Date.now() + POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000,
      };
    }

    const db = firestore();
    const now = Date.now();
    const tenDaysAgo = now - POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000;
    const elevenDaysAgo = now - (POINTS_WINDOW_DAYS + 1) * 24 * 60 * 60 * 1000;

    // Get all verse shares
    const verseSharesSnapshot = await db
      .collection(SHARE_ANALYTICS_COLLECTION)
      .where('deviceId', '==', deviceId)
      .get();

    // Get all app shares
    const appSharesSnapshot = await db
      .collection(APP_SHARE_ANALYTICS_COLLECTION)
      .where('deviceId', '==', deviceId)
      .get();

    // Process verse shares
    const verseShares = verseSharesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        timestamp: data.timestamp || data.createdAt,
        points: POINTS_PER_VERSE_SHARE,
        type: 'verse' as const,
      };
    });

    // Process app shares
    const appShares = appSharesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        timestamp: data.timestamp || data.createdAt,
        points: POINTS_PER_APP_SHARE,
        type: 'app' as const,
      };
    });

    // Combine all shares
    const allShares = [...verseShares, ...appShares];

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
    };
  }
}

