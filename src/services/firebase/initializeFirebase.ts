/**
 * Initialize Firebase app and check all services status
 * React Native Firebase auto-initializes from google-services.json (Android) 
 * and GoogleService-Info.plist (iOS) files.
 */
export const initializeFirebase = (): void => {
  console.log('==========================================');
  console.log('🔥 FIREBASE SETUP STATUS CHECK 🔥');
  console.log('==========================================');
  
  let firebaseStatus = {
    app: false,
    messaging: false,
    firestore: false,
    configFiles: false,
  };

  // Check if config files exist
  try {
    const { existsSync } = require('fs');
    const { join } = require('path');
    const projectRoot = require('process').cwd();
    const googleServicesJsonExists = existsSync(join(projectRoot, 'google-services.json'));
    const googleServicesPlistExists = existsSync(join(projectRoot, 'GoogleService-Info.plist'));
    firebaseStatus.configFiles = googleServicesJsonExists || googleServicesPlistExists;
    
    if (firebaseStatus.configFiles) {
      console.log('✅ Config files found:', {
        android: googleServicesJsonExists ? 'google-services.json ✓' : 'MISSING',
        ios: googleServicesPlistExists ? 'GoogleService-Info.plist ✓' : 'MISSING',
      });
    } else {
      console.log('❌ Config files missing - Firebase will not work');
      console.log('   Need: google-services.json (Android) and/or GoogleService-Info.plist (iOS)');
    }
  } catch (e) {
    console.log('⚠️  Could not check config files');
  }

  // Check Firebase App
  try {
    const { getApp } = require('@react-native-firebase/app');
    const app = getApp();
    firebaseStatus.app = true;
    console.log('✅ Firebase App: INITIALIZED');
    console.log('   App Name:', app.name);
    console.log('   App Options:', {
      projectId: app.options?.projectId || 'N/A',
      storageBucket: app.options?.storageBucket || 'N/A',
    });
  } catch (error: any) {
    console.log('❌ Firebase App: NOT INITIALIZED');
    console.log('   Error:', error?.message || 'Unknown error');
    console.log('   → Make sure config files are in place and rebuild app');
  }

  // Check Firebase Messaging
  try {
    const messaging = require('@react-native-firebase/messaging').default;
    if (messaging) {
      try {
        const messagingInstance = messaging();
        if (messagingInstance) {
          firebaseStatus.messaging = true;
          console.log('✅ Firebase Cloud Messaging: AVAILABLE');
        } else {
          console.log('⚠️  Firebase Cloud Messaging: Module loaded but instance unavailable');
        }
      } catch (e) {
        console.log('⚠️  Firebase Cloud Messaging: Module available but not initialized');
        console.log('   (This is OK if config files are missing)');
      }
    }
  } catch (error: any) {
    console.log('❌ Firebase Cloud Messaging: NOT AVAILABLE');
    console.log('   Error:', error?.message || 'Module not found');
  }

  // Check Firebase Firestore (Cloudstore)
  try {
    const firestore = require('@react-native-firebase/firestore');
    if (firestore) {
      try {
        const firestoreInstance = firestore.default();
        if (firestoreInstance) {
          firebaseStatus.firestore = true;
          console.log('✅ Firebase Cloud Firestore: AVAILABLE');
          console.log('   Ready to read/write data from Firestore');
        }
      } catch (e) {
        console.log('⚠️  Firebase Cloud Firestore: Module available but not initialized');
      }
    }
  } catch (error: any) {
    console.log('⚠️  Firebase Cloud Firestore: NOT INSTALLED');
    console.log('   Install with: npm install @react-native-firebase/firestore');
    console.log('   (Optional - only needed if you want to use Firestore database)');
  }

  // Summary
  console.log('==========================================');
  console.log('📊 FIREBASE STATUS SUMMARY');
  console.log('==========================================');
  console.log('Config Files:', firebaseStatus.configFiles ? '✅ OK' : '❌ MISSING');
  console.log('Firebase App:', firebaseStatus.app ? '✅ OK' : '❌ NOT INITIALIZED');
  console.log('Cloud Messaging:', firebaseStatus.messaging ? '✅ OK' : '⚠️  NOT READY');
  console.log('Cloud Firestore:', firebaseStatus.firestore ? '✅ OK' : '⚠️  NOT INSTALLED');
  
  if (firebaseStatus.app && firebaseStatus.messaging) {
    console.log('==========================================');
    console.log('🎉 Firebase is ready for notifications!');
    console.log('==========================================');
  } else {
    console.log('==========================================');
    console.log('⚠️  Firebase needs configuration');
    console.log('==========================================');
  }
};

/**
 * Get the initialized Firebase app instance
 */
export const getFirebaseApp = () => {
  try {
    const { getApp } = require('@react-native-firebase/app');
    return getApp();
  } catch (error) {
    console.error('Error getting Firebase app:', error);
    return null;
  }
};

