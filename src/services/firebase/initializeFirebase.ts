import { getApp } from '@react-native-firebase/app';

/**
 * Firebase App instance type
 */
type FirebaseApp = ReturnType<typeof getApp>;

/**
 * Initialize Firebase app and check all services status
 * React Native Firebase auto-initializes from google-services.json (Android) 
 * and GoogleService-Info.plist (iOS) files.
 * 
 * This function performs a health check and logs the status of all Firebase services.
 */
export const initializeFirebase = (): void => {
  if (!__DEV__) {
    // Skip initialization checks in production
    return;
  }

  try {
    getApp();
  } catch (error) {
    console.error('[Firebase] Firebase app not initialized:', error);
  }
};

/**
 * Get the initialized Firebase app instance
 * Returns null if Firebase is not initialized
 */
export const getFirebaseApp = (): FirebaseApp | null => {
  try {
    return getApp();
  } catch (error) {
    if (__DEV__) {
      console.error('[Firebase] Error getting Firebase app:', error);
    }
    return null;
  }
};

