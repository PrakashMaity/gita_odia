/**
 * Firebase Web Configuration
 * 
 * This configuration is only needed for web platform support.
 * For native platforms (iOS/Android), Firebase auto-initializes from:
 * - google-services.json (Android)
 * - GoogleService-Info.plist (iOS)
 * 
 * According to React Native Firebase documentation:
 * - Native apps should NOT use initializeApp() - it's auto-configured
 * - Web platform requires dynamic initialization with this config
 * 
 * @see https://rnfirebase.io/#other--web
 */
export const firebaseConfig = {
  apiKey: "AIzaSyDThGq5kLR4HhjXsQP8Ohy3FaAwKQojRsc",
  authDomain: "gita-3be35.firebaseapp.com",
  projectId: "gita-3be35",
  storageBucket: "gita-3be35.firebasestorage.app",
  messagingSenderId: "421350567277",
  appId: "1:421350567277:web:ab987d57925ad6755dfe64"
};

/**
 * Initialize Firebase for web platform only
 * This should only be called when Platform.OS === 'web'
 * 
 * Example usage:
 * ```typescript
 * import { Platform } from 'react-native';
 * import { initializeApp } from '@react-native-firebase/app';
 * 
 * if (Platform.OS === 'web') {
 *   initializeApp(firebaseConfig);
 * }
 * ```
 */
export const initializeFirebaseWeb = () => {
  // This function is a placeholder - implement if web support is needed
  // For now, native apps don't need this
};

