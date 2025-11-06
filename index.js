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


// Export expo-router entry point immediately
// This export must never throw or Metro will crash
export { default } from 'expo-router/entry';

