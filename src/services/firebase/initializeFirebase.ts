import { getApp } from '@react-native-firebase/app';

/**
 * Firebase App instance type
 */
type FirebaseApp = ReturnType<typeof getApp>;

interface FirebaseStatus {
  app: boolean;
}

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

  console.log('==========================================');
  console.log('🔥 FIREBASE SETUP STATUS CHECK 🔥');
  console.log('==========================================');
  
  const firebaseStatus: FirebaseStatus = {
    app: false,
  };

  // Check Firebase App
  // Note: React Native Firebase auto-initializes from google-services.json (Android)
  // and GoogleService-Info.plist (iOS) files. If initialization fails, config files may be missing.
  try {
    const app: FirebaseApp = getApp();
    firebaseStatus.app = true;
    console.log('✅ Firebase App: INITIALIZED');
    console.log('   App Name:', app.name);
    console.log('   App Options:', {
      projectId: app.options?.projectId || 'N/A',
      storageBucket: app.options?.storageBucket || 'N/A',
    });
  } catch (error) {
    console.log('❌ Firebase App: NOT INITIALIZED');
    console.log('   Error:', error instanceof Error ? error.message : 'Unknown error');
    console.log('   → Make sure config files are in place and rebuild app');
  }

  // Summary
  console.log('==========================================');
  console.log('📊 FIREBASE STATUS SUMMARY');
  console.log('==========================================');
  console.log('Firebase App:', firebaseStatus.app ? '✅ OK' : '❌ NOT INITIALIZED');
  
  if (!firebaseStatus.app) {
    console.log('');
    console.log('💡 Note: Firebase config files (google-services.json / GoogleService-Info.plist)');
    console.log('   are required for Firebase to work. Make sure they are in place and rebuild.');
  }
  
  if (firebaseStatus.app) {
    console.log('==========================================');
    console.log('🎉 Firebase is ready!');
    console.log('==========================================');
  } else {
    console.log('==========================================');
    console.log('⚠️  Firebase needs configuration');
    console.log('==========================================');
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

