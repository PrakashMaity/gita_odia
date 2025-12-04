/**
 * Custom error classes for RevenueCat operations
 */

/**
 * Error thrown when a user cancels a purchase
 * This is not a real error - it's expected user behavior
 */
export class PurchaseCancelledError extends Error {
  constructor(message = 'Purchase was cancelled') {
    super(message);
    this.name = 'PurchaseCancelledError';
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PurchaseCancelledError);
    }
  }
}

/**
 * Error thrown when a test store simulates a purchase failure
 * This is expected behavior in test environments
 */
export class PurchaseTestFailureError extends Error {
  constructor(message = 'Purchase failure simulated in test store') {
    super(message);
    this.name = 'PurchaseTestFailureError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PurchaseTestFailureError);
    }
  }
}

/**
 * Error thrown when a purchase fails for reasons other than cancellation or test simulation
 */
export class PurchaseError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'PurchaseError';
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, PurchaseError);
    }
  }
}

