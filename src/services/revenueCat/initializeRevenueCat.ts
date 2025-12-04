import { revenueCatService } from './revenueCatService';
import { initializeRevenueCatFirebaseSync } from './firebaseSync';

/**
 * Initialize RevenueCat
 * Call this once when the app starts
 */
export const initializeRevenueCat = async (): Promise<void> => {
  try {
    await revenueCatService.initialize();
    
    // Initialize Firebase sync after RevenueCat is initialized
    // This links RevenueCat customer with Firebase device
    try {
      await initializeRevenueCatFirebaseSync();
    } catch (error) {
      console.error('[RevenueCat] Error initializing Firebase sync:', error);
      // Don't throw - Firebase sync is optional, RevenueCat should still work
    }
  } catch (error) {
    console.error('Failed to initialize RevenueCat:', error);
    // Don't throw - allow app to continue even if RevenueCat fails
  }
};

