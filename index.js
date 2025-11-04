/**
 * Suppress expo-keep-awake initialization errors (non-critical)
 * This must run BEFORE any other modules are imported to catch the error early
 * The error occurs when expo-keep-awake tries to auto-initialize but can't activate
 */
(function suppressKeepAwakeErrors() {
  'use strict';
  
  if (typeof global === 'undefined') {
    return;
  }

  // Suppress console.error for keep-awake errors
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const errorMessage = args[0];
    const shouldSuppress =
      (typeof errorMessage === 'string' && errorMessage.includes('Unable to activate keep awake')) ||
      (errorMessage instanceof Error && errorMessage.message?.includes('Unable to activate keep awake')) ||
      (args.length > 0 && typeof args[0] === 'object' && args[0]?.message?.includes('Unable to activate keep awake')) ||
      (args.length > 0 && typeof args[0] === 'object' && args[0]?.toString?.().includes('Unable to activate keep awake'));
    
    if (shouldSuppress) {
      // Suppress this specific error - it's non-critical
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Handle React Native's ErrorUtils for unhandled promise rejections
  // This catches "Uncaught (in promise)" errors
  if (global.ErrorUtils) {
    const originalErrorHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler(function(error, isFatal) {
      if (
        error &&
        (error.message?.includes('Unable to activate keep awake') ||
         error.toString?.().includes('Unable to activate keep awake') ||
         String(error).includes('Unable to activate keep awake'))
      ) {
        // Suppress keep-awake errors - they're non-critical
        return;
      }
      // Call original handler for other errors
      if (originalErrorHandler) {
        originalErrorHandler(error, isFatal);
      }
    });
  }

  // Also catch promise rejections that might not go through ErrorUtils
  if (typeof Promise !== 'undefined' && Promise.prototype.catch) {
    const originalPromiseRejectionHandler = global.onunhandledrejection;
    if (typeof global.addEventListener === 'function') {
      global.addEventListener('unhandledrejection', function(event) {
        const error = event?.reason || event?.detail || event;
        if (
          (typeof error === 'string' && error.includes('Unable to activate keep awake')) ||
          (error instanceof Error && error.message?.includes('Unable to activate keep awake')) ||
          (error && typeof error === 'object' && String(error).includes('Unable to activate keep awake'))
        ) {
          event.preventDefault?.();
          event.stopPropagation?.();
          return false;
        }
      }, true);
    }
  }
})();

/**
 * Firebase background message handler registration
 * 
 * This handler processes notifications when the app is in the background or terminated.
 * It must be registered at the root level (in index.js) before the app code runs.
 * 
 * According to React Native Firebase documentation:
 * - setBackgroundMessageHandler must be called outside of React lifecycle
 * - It runs in a separate JavaScript context
 * - It should handle data-only messages or update local storage
 * 
 * Using modular API: getMessaging(app) instead of messaging()
 * 
 * @see https://rnfirebase.io/messaging/usage#background-application-state
 * @see https://rnfirebase.io/migrating-to-v22
 */
(function registerBackgroundMessageHandler() {
  'use strict';
  
  try {
    // Use modular API imports
    const { getApp } = require('@react-native-firebase/app');
    const { getMessaging } = require('@react-native-firebase/messaging');
    
    if (!getApp || !getMessaging) {
      return;
    }
    
    try {
      // Use modular API: getMessaging(app) instead of messaging()
      const app = getApp();
      const messagingInstance = getMessaging(app);
      
      if (messagingInstance && typeof messagingInstance.setBackgroundMessageHandler === 'function') {
        messagingInstance.setBackgroundMessageHandler(async (remoteMessage) => {
          // Handle background message
          // This runs in a separate JS context, so we can't use React components or navigation here
          if (__DEV__) {
            console.log('[Firebase] Background message received:', remoteMessage);
          }
          
          // Process notification data here
          // Example: Update local storage, schedule local notifications, etc.
          // For now, we just log it - you can extend this based on your needs
          
          // Note: If you need to show a notification in the background,
          // you should send a notification payload from your server, not a data-only message
        });
        
        if (__DEV__) {
          console.log('[Firebase] Background message handler registered');
        }
      }
    } catch (error) {
      // Firebase app not initialized - will work once config files are added
      // This is expected if config files are missing
      if (__DEV__ && error instanceof Error) {
        console.warn('[Firebase] Could not register background handler:', error.message);
      }
    }
  } catch (error) {
    // Firebase module unavailable - this is OK for Metro startup
    // This can happen if the module isn't installed or during development
    if (__DEV__ && error instanceof Error) {
      console.warn('[Firebase] Background handler not available:', error.message);
    }
  }
})();

// Export expo-router entry point immediately
// This export must never throw or Metro will crash
export { default } from 'expo-router/entry';

