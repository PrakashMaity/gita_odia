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

  // Suppress specific non-critical errors
  const originalConsoleError = console.error;
  console.error = function (...args) {
    const errorMessage = args[0];

    // Check for KeepAwake errors
    const isKeepAwakeError =
      (typeof errorMessage === 'string' && errorMessage.includes('Unable to activate keep awake')) ||
      (errorMessage instanceof Error && errorMessage.message?.includes('Unable to activate keep awake')) ||
      (args.length > 0 && typeof args[0] === 'object' && args[0]?.message?.includes('Unable to activate keep awake')) ||
      (args.length > 0 && typeof args[0] === 'object' && args[0]?.toString?.().includes('Unable to activate keep awake'));

    // Check for RevenueCat Network errors (non-critical, handled by UI)
    const isRevenueCatNetworkError =
      (typeof errorMessage === 'string' && errorMessage.includes('[RevenueCat]') && errorMessage.includes('NetworkError')) ||
      (typeof errorMessage === 'string' && errorMessage.includes('Unable to resolve host "api.revenuecat.com"')) ||
      (typeof errorMessage === 'string' && errorMessage.includes('Unable to resolve host "api-production'));

    if (isKeepAwakeError || isRevenueCatNetworkError) {
      // Suppress these specific errors - they are non-critical
      return;
    }
    originalConsoleError.apply(console, args);
  };

  // Handle React Native's ErrorUtils for unhandled promise rejections
  // This catches "Uncaught (in promise)" errors
  if (global.ErrorUtils) {
    const originalErrorHandler = global.ErrorUtils.getGlobalHandler();
    global.ErrorUtils.setGlobalHandler(function (error, isFatal) {
      const errorMessage = error?.message || '';
      const stringError = String(error);

      const isKeepAwakeError =
        errorMessage.includes('Unable to activate keep awake') ||
        error?.toString?.().includes('Unable to activate keep awake') ||
        stringError.includes('Unable to activate keep awake');

      const isRevenueCatNetworkError =
        (stringError.includes('[RevenueCat]') && stringError.includes('NetworkError')) ||
        stringError.includes('Unable to resolve host "api.revenuecat.com"') ||
        stringError.includes('Unable to resolve host "api-production');

      if (isKeepAwakeError || isRevenueCatNetworkError) {
        // Suppress these specific errors - they're non-critical
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
      global.addEventListener('unhandledrejection', function (event) {
        const error = event?.reason || event?.detail || event;
        const errorMessage = error instanceof Error ? error.message : '';
        const stringError = String(error);

        const isKeepAwakeError =
          (typeof error === 'string' && error.includes('Unable to activate keep awake')) ||
          errorMessage.includes('Unable to activate keep awake') ||
          (error && typeof error === 'object' && stringError.includes('Unable to activate keep awake'));

        const isRevenueCatNetworkError =
          (stringError.includes('[RevenueCat]') && stringError.includes('NetworkError')) ||
          stringError.includes('Unable to resolve host "api.revenuecat.com"') ||
          stringError.includes('Unable to resolve host "api-production');

        if (isKeepAwakeError || isRevenueCatNetworkError) {
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

