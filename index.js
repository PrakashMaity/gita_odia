// Firebase background message handler registration
// Wrapped in IIFE with comprehensive error handling to ensure Metro never crashes

(function() {
  'use strict';
  try {
    const messagingModule = require('@react-native-firebase/messaging');
    if (!messagingModule) return;
    
    const messaging = messagingModule.default;
    if (!messaging || typeof messaging !== 'function') return;
    
    try {
      const instance = messaging();
      if (instance && typeof instance.setBackgroundMessageHandler === 'function') {
        instance.setBackgroundMessageHandler(async (remoteMessage) => {
          console.log('Message handled in the background!', remoteMessage);
        });
      }
    } catch (e) {
      // Firebase app not initialized - will work once config files are added
    }
  } catch (e) {
    // Firebase module unavailable - this is OK for Metro startup
  }
})();

// Export expo-router entry point immediately
// This export must never throw or Metro will crash
export { default } from 'expo-router/entry';

