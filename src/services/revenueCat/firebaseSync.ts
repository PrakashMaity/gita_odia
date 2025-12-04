/**
 * Firebase Sync Service for RevenueCat Subscriptions
 * 
 * This service synchronizes RevenueCat subscription data with Firebase:
 * - Stores subscription status in Firestore
 * - Links RevenueCat customer ID with Firebase device ID
 * - Tracks subscription events in Firebase Analytics
 * - Enables cross-device subscription sync
 */

import { Platform } from 'react-native';
import '@react-native-firebase/firestore';
import {
  collection,
  doc,
  getFirestore,
  setDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore/lib/modular';
import { getApp } from '@react-native-firebase/app';
import type { CustomerInfo, PurchasesEntitlementInfo } from 'react-native-purchases';
import { revenueCatService } from './revenueCatService';
import { getCurrentDeviceInfo } from '@/services/deviceRegistration';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUBSCRIPTION_SYNC_KEY = 'gita_subscription_sync_pending';
const REVENUECAT_USER_ID_KEY = 'gita_revenuecat_user_id';

export interface SubscriptionData {
  // RevenueCat identifiers
  revenueCatCustomerId: string | null;
  revenueCatAppUserId: string | null;
  
  // Subscription status
  isPremium: boolean;
  hasActiveSubscription: boolean;
  
  // Active entitlements
  activeEntitlements: Record<string, PurchasesEntitlementInfo>;
  entitlementIds: string[];
  
  // Active subscriptions
  activeSubscriptions: string[];
  
  // Subscription details
  latestExpirationDate: string | null;
  firstSeen: number | null;
  originalPurchaseDate: string | null;
  
  // Management
  managementURL: string | null;
  
  // Timestamps
  lastSyncedAt: number;
  subscriptionFirstActivated: number | null;
  subscriptionExpiresAt: number | null;
}

export interface DeviceSubscriptionData extends SubscriptionData {
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  updatedAt: number;
  createdAt: number;
}

/**
 * Get RevenueCat User ID from storage or generate one
 */
async function getOrCreateRevenueCatUserId(): Promise<string | null> {
  try {
    const deviceInfo = await getCurrentDeviceInfo();
    // Use device ID as RevenueCat user ID for consistency
    return deviceInfo.deviceId;
  } catch (error) {
    console.error('[FirebaseSync] Error getting RevenueCat user ID:', error);
    return null;
  }
}

/**
 * Set RevenueCat user ID to link with Firebase device
 */
export async function syncRevenueCatUserIdToFirebase(): Promise<void> {
  try {
    const userId = await getOrCreateRevenueCatUserId();
    if (!userId) {
      console.warn('[FirebaseSync] No user ID available for RevenueCat');
      return;
    }

    // Set user ID in RevenueCat
    await revenueCatService.setUserId(userId);
    
    // Store for reference
    await AsyncStorage.setItem(REVENUECAT_USER_ID_KEY, userId);
  } catch (error) {
    console.error('[FirebaseSync] Error syncing RevenueCat user ID:', error);
  }
}

/**
 * Remove undefined values from object (Firestore doesn't support undefined, but supports null)
 */
function removeUndefinedValues<T extends Record<string, any>>(obj: T): T {
  const cleaned: any = {};
  for (const [key, value] of Object.entries(obj)) {
    // Skip undefined values (null is allowed in Firestore)
    if (value === undefined) {
      continue;
    }
    
    if (Array.isArray(value)) {
      // Filter out undefined from arrays and clean each item
      const cleanedArray = value
        .filter(item => item !== undefined)
        .map(item => {
          if (item !== null && typeof item === 'object' && !(item instanceof Date)) {
            return removeUndefinedValues(item);
          }
          return item;
        });
      // Include array even if empty (Firestore supports empty arrays)
      cleaned[key] = cleanedArray;
    } else if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
      // Recursively clean nested objects (null is allowed)
      const cleanedValue = removeUndefinedValues(value);
      // Only add if object has at least one property
      if (Object.keys(cleanedValue).length > 0) {
        cleaned[key] = cleanedValue;
      }
    } else {
      // Primitive values (string, number, boolean, Date, null, etc.)
      cleaned[key] = value;
    }
  }
  return cleaned as T;
}

/**
 * Convert CustomerInfo to SubscriptionData
 */
function customerInfoToSubscriptionData(customerInfo: CustomerInfo): SubscriptionData {
  const activeEntitlements = customerInfo.entitlements.active;
  const activeSubscriptionIds = Object.keys(customerInfo.entitlements.active);
  const activeSubscriptions = Object.values(customerInfo.activeSubscriptions);
  
  // Get latest expiration date
  let latestExpirationDate: string | null = null;
  let subscriptionExpiresAt: number | null = null;
  
  Object.values(activeEntitlements).forEach(entitlement => {
    if (entitlement.expirationDate) {
      const expDate = new Date(entitlement.expirationDate);
      const expTimestamp = expDate.getTime();
      if (!latestExpirationDate || expTimestamp > (subscriptionExpiresAt || 0)) {
        latestExpirationDate = entitlement.expirationDate;
        subscriptionExpiresAt = expTimestamp;
      }
    }
  });

  // Get first seen and original purchase date
  const firstSeen = customerInfo.firstSeen 
    ? new Date(customerInfo.firstSeen).getTime() 
    : null;
  
  const originalPurchaseDate = customerInfo.originalPurchaseDate || null;

  // Clean activeEntitlements to remove undefined values
  const cleanedActiveEntitlements: Record<string, PurchasesEntitlementInfo> = {};
  Object.entries(activeEntitlements).forEach(([key, entitlement]) => {
    if (entitlement) {
      // Clean entitlement object to remove undefined values
      const cleanedEntitlement: any = {};
      Object.entries(entitlement).forEach(([entKey, entValue]) => {
        if (entValue !== undefined) {
          cleanedEntitlement[entKey] = entValue;
        }
      });
      if (Object.keys(cleanedEntitlement).length > 0) {
        cleanedActiveEntitlements[key] = cleanedEntitlement as PurchasesEntitlementInfo;
      }
    }
  });

  return {
    revenueCatCustomerId: customerInfo.originalAppUserId || null,
    revenueCatAppUserId: customerInfo.originalAppUserId || null,
    isPremium: Object.keys(cleanedActiveEntitlements).length > 0,
    hasActiveSubscription: activeSubscriptionIds.length > 0,
    activeEntitlements: cleanedActiveEntitlements,
    entitlementIds: activeSubscriptionIds.length > 0 ? activeSubscriptionIds : [],
    activeSubscriptions: activeSubscriptions.length > 0 
      ? activeSubscriptions.map(sub => sub?.productIdentifier).filter(Boolean) as string[]
      : [],
    latestExpirationDate: latestExpirationDate || null,
    firstSeen: firstSeen || null,
    originalPurchaseDate: originalPurchaseDate || null,
    managementURL: customerInfo.managementURL || null,
    lastSyncedAt: Date.now(),
    subscriptionFirstActivated: firstSeen || null,
    subscriptionExpiresAt: subscriptionExpiresAt || null,
  };
}

/**
 * Sync subscription data to Firestore
 */
export async function syncSubscriptionToFirebase(
  customerInfo: CustomerInfo,
  deviceId?: string
): Promise<void> {
  try {
    const app = getApp();
    if (!app) {
      throw new Error('Firebase app not initialized');
    }

    // Get device info if not provided
    let currentDeviceId = deviceId;
    if (!currentDeviceId) {
      const deviceInfo = await getCurrentDeviceInfo();
      currentDeviceId = deviceInfo.deviceId;
    }

    if (!currentDeviceId) {
      throw new Error('Device ID not available');
    }

    const db = getFirestore();
    const subscriptionData = customerInfoToSubscriptionData(customerInfo);

    // Update device document with subscription data
    const deviceRef = doc(collection(db, 'UserClients'), currentDeviceId);
    
    const deviceSubscriptionData: DeviceSubscriptionData = {
      ...subscriptionData,
      deviceId: currentDeviceId,
      platform: Platform.OS as 'ios' | 'android' | 'web',
      updatedAt: Date.now(),
      createdAt: Date.now(),
    };

    // Remove undefined values before writing to Firestore
    const cleanedDeviceData = removeUndefinedValues({
      ...deviceSubscriptionData,
      updatedAt: serverTimestamp(),
    });

    // Merge subscription data with existing device document
    await setDoc(deviceRef, cleanedDeviceData, { merge: true });

    // Also create/update subscription document for easier querying
    if (subscriptionData.revenueCatAppUserId) {
      const subscriptionRef = doc(
        collection(db, 'Subscriptions'),
        subscriptionData.revenueCatAppUserId
      );
      
      // Remove undefined values before writing to Firestore
      const cleanedSubscriptionData = removeUndefinedValues({
        ...subscriptionData,
        deviceId: currentDeviceId,
        platform: Platform.OS as 'ios' | 'android' | 'web',
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      });

      await setDoc(subscriptionRef, cleanedSubscriptionData, { merge: true });
    }

    // Clear pending sync flag
    await AsyncStorage.removeItem(SUBSCRIPTION_SYNC_KEY);
  } catch (error) {
    console.error('[FirebaseSync] Error syncing subscription to Firebase:', error);
    // Mark as pending sync for retry
    await AsyncStorage.setItem(SUBSCRIPTION_SYNC_KEY, 'true');
    throw error;
  }
}

/**
 * Track subscription event in Firebase Analytics
 * Note: Firebase Analytics is optional - events are logged to Firestore for now
 */
export async function trackSubscriptionEvent(
  eventName: string,
  params?: Record<string, any>
): Promise<void> {
  try {
    const app = getApp();
    if (!app) {
      console.warn('[FirebaseSync] Firebase app not initialized');
      return;
    }

    // Store event in Firestore for analytics tracking
    const db = getFirestore();
    const eventsRef = collection(db, 'SubscriptionEvents');
    
    await setDoc(doc(eventsRef), {
      eventName,
      platform: Platform.OS,
      ...params,
      timestamp: serverTimestamp(),
      createdAt: Date.now(),
    });
  } catch (error) {
    console.error('[FirebaseSync] Error tracking event:', error);
  }
}

/**
 * Track purchase success event
 */
export async function trackPurchaseSuccess(
  productIdentifier: string,
  customerInfo: CustomerInfo
): Promise<void> {
  const subscriptionData = customerInfoToSubscriptionData(customerInfo);
  
  await trackSubscriptionEvent('purchase_success', {
    product_identifier: productIdentifier,
    is_premium: subscriptionData.isPremium,
    has_active_subscription: subscriptionData.hasActiveSubscription,
    entitlement_ids: subscriptionData.entitlementIds.join(','),
    expiration_date: subscriptionData.latestExpirationDate,
  });
}

/**
 * Track purchase cancellation event
 */
export async function trackPurchaseCancelled(
  productIdentifier: string
): Promise<void> {
  await trackSubscriptionEvent('purchase_cancelled', {
    product_identifier: productIdentifier,
  });
}

/**
 * Track subscription restoration event
 */
export async function trackRestorePurchases(
  customerInfo: CustomerInfo
): Promise<void> {
  const subscriptionData = customerInfoToSubscriptionData(customerInfo);
  
  await trackSubscriptionEvent('restore_purchases', {
    is_premium: subscriptionData.isPremium,
    has_active_subscription: subscriptionData.hasActiveSubscription,
    entitlement_ids: subscriptionData.entitlementIds.join(','),
  });
}

/**
 * Sync current subscription status to Firebase
 */
export async function syncCurrentSubscriptionToFirebase(): Promise<void> {
  try {
    const customerInfo = await revenueCatService.getCustomerInfo();
    await syncSubscriptionToFirebase(customerInfo);
  } catch (error) {
    console.error('[FirebaseSync] Error syncing current subscription:', error);
    throw error;
  }
}

/**
 * Sync pending subscription data when online
 */
export async function syncPendingSubscriptionData(): Promise<void> {
  try {
    const pendingSync = await AsyncStorage.getItem(SUBSCRIPTION_SYNC_KEY);
    if (!pendingSync || pendingSync !== 'true') {
      return; // No pending sync
    }

    await syncCurrentSubscriptionToFirebase();
  } catch (error) {
    console.error('[FirebaseSync] Error syncing pending subscription data:', error);
  }
}

/**
 * Initialize Firebase sync for RevenueCat
 * This should be called after RevenueCat is initialized
 */
export async function initializeRevenueCatFirebaseSync(): Promise<void> {
  try {
    // Link RevenueCat user ID with Firebase device
    await syncRevenueCatUserIdToFirebase();
    
    // Sync current subscription status
    await syncCurrentSubscriptionToFirebase();
    
    // Sync any pending data
    await syncPendingSubscriptionData();
  } catch (error) {
    console.error('[FirebaseSync] Error initializing Firebase sync:', error);
  }
}

