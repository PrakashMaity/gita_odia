import * as Application from 'expo-application';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import '@react-native-firebase/firestore';
import {
  collection,
  doc,
  getFirestore,
  setDoc,
} from '@react-native-firebase/firestore/lib/modular';
import { getApp } from '@react-native-firebase/app';

const DEVICE_ID_KEY = 'gita_device_id';
const DEVICE_DATA_KEY = 'gita_device_data';
const PENDING_SYNC_KEY = 'gita_pending_sync';

export interface DeviceInfo {
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  deviceName: string;
  deviceModel: string | null;
  osVersion: string | null;
  appVersion: string | null;
  buildNumber: string | null;
  bundleId: string | null;
  installationId: string | null;
  firstInstallTime: number;
  lastSyncTime: number | null;
  isOnline: boolean;
}

export interface DeviceRegistrationData {
  deviceId: string;
  platform: 'ios' | 'android' | 'web';
  deviceName: string;
  deviceModel: string | null;
  osVersion: string | null;
  appVersion: string | null;
  buildNumber: string | null;
  bundleId: string | null;
  installationId: string | null;
  firstInstallTime: number;
  lastSyncTime: number | null;
  createdAt: number;
  updatedAt: number;
}

/**
* Generate or retrieve a unique device ID
*/
async function getOrCreateDeviceId(): Promise<string> {
  const generateFallbackId = () =>
    `${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random()
      .toString(36)
      .substring(2, 15)}`;

  try {
    // Try to get existing device ID from secure storage
    let deviceId = await SecureStore.getItemAsync(DEVICE_ID_KEY);
    
    if (!deviceId) {
      // Generate a new unique device ID
      // Use installation ID if available, otherwise generate UUID
      let installationId: string | null = null;
      try {
        if (Platform.OS === 'android' && typeof Application.getAndroidId === 'function') {
          installationId = Application.getAndroidId?.() ?? null;
        } else if (Platform.OS === 'ios' && typeof Application.getIosIdForVendorAsync === 'function') {
          installationId = await Application.getIosIdForVendorAsync();
        }
      } catch {
        // Installation ID not available, will generate one
      }
      
      deviceId = installationId || generateFallbackId();
      
      // Store the device ID
      await SecureStore.setItemAsync(DEVICE_ID_KEY, deviceId);
    }
    
    return deviceId;
  } catch (error) {
    console.error('Error getting/creating device ID:', error);
    // Fallback: generate a temporary ID
    return generateFallbackId();
  }
}

/**
 * Collect device information
 */
async function collectDeviceInfo(): Promise<DeviceInfo> {
  const deviceId = await getOrCreateDeviceId();
  
  let deviceName = 'Unknown Device';
  let deviceModel: string | null = null;
  let osVersion: string | null = null;
  let appVersion: string | null = null;
  let buildNumber: string | null = null;
  let bundleId: string | null = null;
  let installationId: string | null = null;
  
    try {
      // Get application info
      deviceName = Application.applicationName || 'Unknown Device';
      
      appVersion = Application.nativeApplicationVersion || null;
      buildNumber = Application.nativeBuildVersion || null;
      bundleId = Application.applicationId || null;
      
      try {
        if (Platform.OS === 'android' && typeof Application.getAndroidId === 'function') {
          installationId = Application.getAndroidId?.() || null;
        } else if (Platform.OS === 'ios' && typeof Application.getIosIdForVendorAsync === 'function') {
          installationId = await Application.getIosIdForVendorAsync();
        }
      } catch {
        installationId = null;
      }
    
    // Get OS version
    osVersion = Platform.Version?.toString() || null;
    
    // Get device model (platform-specific)
    if (Platform.OS === 'ios') {
      // iOS device model would need additional native module
      deviceModel = 'iOS Device';
    } else if (Platform.OS === 'android') {
      // Android device model would need additional native module
      deviceModel = 'Android Device';
    }
  } catch (error) {
    console.error('Error collecting device info:', error);
  }
  
  // Get first install time from storage or use current time
  let firstInstallTime: number;
  try {
    const stored = await AsyncStorage.getItem('gita_first_install_time');
    if (stored) {
      firstInstallTime = parseInt(stored, 10);
    } else {
      firstInstallTime = Date.now();
      await AsyncStorage.setItem('gita_first_install_time', firstInstallTime.toString());
    }
  } catch (error) {
    firstInstallTime = Date.now();
  }
  
  // Get last sync time
  let lastSyncTime: number | null = null;
  try {
    const stored = await AsyncStorage.getItem('gita_last_sync_time');
    if (stored) {
      lastSyncTime = parseInt(stored, 10);
    }
  } catch (error) {
    // Ignore error
  }
  
  return {
    deviceId,
    platform: Platform.OS as 'ios' | 'android' | 'web',
    deviceName,
    deviceModel,
    osVersion,
    appVersion,
    buildNumber,
    bundleId,
    installationId,
    firstInstallTime,
    lastSyncTime,
    isOnline: false, // Will be updated by network listener
  };
}

/**
 * Save device data to local storage (offline)
 */
async function saveDeviceDataOffline(deviceInfo: DeviceInfo): Promise<void> {
  try {
    const deviceData: DeviceRegistrationData = {
      ...deviceInfo,
      createdAt: deviceInfo.firstInstallTime,
      updatedAt: Date.now(),
    };
    
    await AsyncStorage.setItem(DEVICE_DATA_KEY, JSON.stringify(deviceData));
    
    // Mark as pending sync
    await AsyncStorage.setItem(PENDING_SYNC_KEY, 'true');
  } catch (error) {
    console.error('Error saving device data offline:', error);
  }
}

/**
 * Register device to Firestore
 */
async function registerDeviceToFirestore(deviceInfo: DeviceInfo): Promise<void> {
  try {
    const app = getApp();
    if (!app) {
      throw new Error('Firebase app not initialized');
    }
    
    const db = getFirestore();
    
    const deviceData: DeviceRegistrationData = {
      deviceId: deviceInfo.deviceId,
      platform: deviceInfo.platform,
      deviceName: deviceInfo.deviceName,
      deviceModel: deviceInfo.deviceModel,
      osVersion: deviceInfo.osVersion,
      appVersion: deviceInfo.appVersion,
      buildNumber: deviceInfo.buildNumber,
      bundleId: deviceInfo.bundleId,
      installationId: deviceInfo.installationId,
      firstInstallTime: deviceInfo.firstInstallTime,
      lastSyncTime: Date.now(),
      createdAt: deviceInfo.firstInstallTime,
      updatedAt: Date.now(),
    };
    
    // Use deviceId as document ID in UserClients collection
    const deviceRef = doc(collection(db, 'UserClients'), deviceInfo.deviceId);
    
    // Use set with merge to update existing or create new
    await setDoc(deviceRef, deviceData, { merge: true });
    
    // Update last sync time
    await AsyncStorage.setItem('gita_last_sync_time', Date.now().toString());
    await AsyncStorage.removeItem(PENDING_SYNC_KEY);
  } catch (error) {
    console.error('Error registering device to Firestore:', error);
    throw error;
  }
}

/**
 * Sync pending device data when online
 */
async function syncPendingDeviceData(): Promise<void> {
  try {
    const pendingSync = await AsyncStorage.getItem(PENDING_SYNC_KEY);
    if (!pendingSync || pendingSync !== 'true') {
      return; // No pending sync
    }
    
    const deviceDataStr = await AsyncStorage.getItem(DEVICE_DATA_KEY);
    if (!deviceDataStr) {
      return; // No device data to sync
    }
    
    const deviceData: DeviceRegistrationData = JSON.parse(deviceDataStr);
    const deviceInfo: DeviceInfo = {
      deviceId: deviceData.deviceId,
      platform: deviceData.platform,
      deviceName: deviceData.deviceName,
      deviceModel: deviceData.deviceModel,
      osVersion: deviceData.osVersion,
      appVersion: deviceData.appVersion,
      buildNumber: deviceData.buildNumber,
      bundleId: deviceData.bundleId,
      installationId: deviceData.installationId,
      firstInstallTime: deviceData.firstInstallTime,
      lastSyncTime: deviceData.lastSyncTime,
      isOnline: true,
    };
    
    try {
      await registerDeviceToFirestore(deviceInfo);
    } catch {
      // If offline, data is already saved locally
    }
  } catch (error) {
    console.error('Error syncing pending device data:', error);
  }
}

/**
 * Initialize device registration
 * This should be called when the app starts
 */
export async function initializeDeviceRegistration(): Promise<void> {
  try {
    // Collect device info
    const deviceInfo = await collectDeviceInfo();
    
    // Save to local storage first (offline support)
    await saveDeviceDataOffline(deviceInfo);
    
    // Try to register to Firestore (if online)
    await registerDeviceToFirestore(deviceInfo);
  } catch (error) {
    console.error('Error initializing device registration:', error);
  }
}

/**
 * Sync device data when app comes online
 * This should be called when network connectivity is detected
 */
export async function syncDeviceDataWhenOnline(): Promise<void> {
  try {
    await syncPendingDeviceData();
    
    // Also update current device info
    const deviceInfo = await collectDeviceInfo();
    deviceInfo.isOnline = true;
    
    try {
      await registerDeviceToFirestore(deviceInfo);
    } catch (error) {
      console.error('Error syncing device data:', error);
    }
  } catch (error) {
    console.error('Error in syncDeviceDataWhenOnline:', error);
  }
}

/**
 * Get current device info
 */
export async function getCurrentDeviceInfo(): Promise<DeviceInfo> {
  return await collectDeviceInfo();
}

