/**
 * useRatingPrompter Hook
 * 
 * Automatically shows a rating prompt after the user has used the app
 * in the foreground for a total of 4 minutes (240 seconds).
 * 
 * Features:
 * - Tracks foreground usage time only
 * - Persists time across app restarts using AsyncStorage
 * - Shows native in-app review prompt (expo-store-review)
 * - Falls back to Play Store link if native review unavailable
 * - Only shows once per user (stores flag to prevent re-showing)
 * 
 * Requirements:
 * - Install expo-store-review: npx expo install expo-store-review
 * - AsyncStorage is already installed (@react-native-async-storage/async-storage)
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus, Linking } from 'react-native';

// Constants
const STORAGE_KEYS = {
  TOTAL_USAGE_SECONDS: 'rating_prompter_total_usage_seconds',
  HAS_SHOWN_RATING: 'rating_prompter_has_shown',
  LAST_FOREGROUND_TIMESTAMP: 'rating_prompter_last_foreground_timestamp',
} as const;

const REQUIRED_USAGE_SECONDS = 240; // 4 minutes

// Play Store URL - Update this with your actual Play Store package ID
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.proninja.bhagavad_gita';

/**
 * Loads the total usage time from AsyncStorage
 */
const loadTotalUsageSeconds = async (): Promise<number> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.TOTAL_USAGE_SECONDS);
    return stored ? parseInt(stored, 10) : 0;
  } catch (error) {
    console.error('Error loading total usage seconds:', error);
    return 0;
  }
};

/**
 * Saves the total usage time to AsyncStorage
 */
const saveTotalUsageSeconds = async (seconds: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOTAL_USAGE_SECONDS, seconds.toString());
  } catch (error) {
    console.error('Error saving total usage seconds:', error);
  }
};

/**
 * Checks if the rating prompt has already been shown
 */
const hasShownRating = async (): Promise<boolean> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.HAS_SHOWN_RATING);
    return stored === 'true';
  } catch (error) {
    console.error('Error checking rating shown status:', error);
    return false;
  }
};

/**
 * Marks the rating prompt as shown
 */
const markRatingAsShown = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.HAS_SHOWN_RATING, 'true');
  } catch (error) {
    console.error('Error marking rating as shown:', error);
  }
};


/**
 * Saves the timestamp when app goes to foreground
 */
const saveForegroundTimestamp = async (timestamp: number): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      STORAGE_KEYS.LAST_FOREGROUND_TIMESTAMP,
      timestamp.toString()
    );
  } catch (error) {
    console.error('Error saving foreground timestamp:', error);
  }
};

/**
 * Loads the last foreground timestamp
 */
const loadForegroundTimestamp = async (): Promise<number | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.LAST_FOREGROUND_TIMESTAMP);
    return stored ? parseInt(stored, 10) : null;
  } catch (error) {
    console.error('Error loading foreground timestamp:', error);
    return null;
  }
};

/**
 * Attempts to show native in-app review, falls back to Play Store if unavailable
 * In DEV mode, always uses Play Store link (native review doesn't work in emulators)
 * 
 * Can be called manually to trigger rating prompt from anywhere in the app
 */
export const showRatingPrompt = async (): Promise<void> => {
  try {
    // In dev mode, always use Play Store link (native review doesn't work in emulators)
    if (__DEV__) {
      console.log('[RatingPrompter] DEV mode: Opening Play Store link directly');
      await openPlayStoreLink();
      return;
    }

    // Check if native in-app review is available
    const isAvailable = await StoreReview.isAvailableAsync();
    
    if (isAvailable) {
      // Request native in-app review
      await StoreReview.requestReview();
      // Note: Native review might not always show due to OS rate limiting
      // That's expected behavior - OS controls when to show it
    } else {
      // Fallback to Play Store link if native review unavailable
      await openPlayStoreLink();
    }
  } catch (error) {
    console.error('Error showing rating prompt:', error);
    // Fallback to Play Store on any error
    await openPlayStoreLink();
  }
};

/**
 * Opens the Play Store URL as a fallback
 */
const openPlayStoreLink = async (): Promise<void> => {
  try {
    const canOpen = await Linking.canOpenURL(PLAY_STORE_URL);
    if (canOpen) {
      await Linking.openURL(PLAY_STORE_URL);
    } else {
      console.error('Cannot open Play Store URL:', PLAY_STORE_URL);
    }
  } catch (error) {
    console.error('Error opening Play Store link:', error);
  }
};

/**
 * Hook to automatically show rating prompt after 4 minutes (240 seconds) of foreground usage
 */
export const useRatingPrompter = () => {
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const totalUsageRef = useRef<number>(0);
  const hasShownRef = useRef<boolean>(false);
  const isInitializedRef = useRef<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let subscription: { remove: () => void } | null = null;

    /**
     * Stops tracking foreground time
     */
    const stopTracking = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    /**
     * Starts tracking foreground time with interval
     */
    const startTracking = () => {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Update every second while in foreground
      intervalRef.current = setInterval(async () => {
        if (!isMounted || hasShownRef.current || !isInitializedRef.current) {
          stopTracking();
          return;
        }

        // Increment total usage
        totalUsageRef.current += 1;
        await saveTotalUsageSeconds(totalUsageRef.current);

        // Check if threshold reached
        if (totalUsageRef.current >= REQUIRED_USAGE_SECONDS) {
          await showRatingPrompt();
          await markRatingAsShown();
          hasShownRef.current = true;
          stopTracking();
        }
      }, 1000); // Update every second
    };

    /**
     * Handles app state changes (foreground/background)
     */
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (!isMounted || hasShownRef.current || !isInitializedRef.current) return;

      const currentState = appStateRef.current;

      // App is coming to foreground
      if (currentState.match(/inactive|background/) && nextAppState === 'active') {
        const now = Date.now();
        await saveForegroundTimestamp(now);
        
        // Start tracking time
        startTracking();
      }

      // App is going to background
      if (currentState === 'active' && nextAppState.match(/inactive|background/)) {
        stopTracking();
        
        // Calculate and save elapsed time
        const lastTimestamp = await loadForegroundTimestamp();
        if (lastTimestamp) {
          const elapsedSeconds = Math.floor((Date.now() - lastTimestamp) / 1000);
          const newTotal = totalUsageRef.current + elapsedSeconds;
          
          totalUsageRef.current = newTotal;
          await saveTotalUsageSeconds(newTotal);
          
          // Check if threshold reached
          if (newTotal >= REQUIRED_USAGE_SECONDS && !hasShownRef.current) {
            await showRatingPrompt();
            await markRatingAsShown();
            hasShownRef.current = true;
            stopTracking();
          }
        }
      }

      appStateRef.current = nextAppState;
    };

    /**
     * Initialize the hook
     */
    const initialize = async () => {
      if (!isMounted) return;

      // Load persisted data
      const [totalUsage, hasShown] = await Promise.all([
        loadTotalUsageSeconds(),
        hasShownRating(),
      ]);

      if (!isMounted) return;

      totalUsageRef.current = totalUsage;
      hasShownRef.current = hasShown;
      isInitializedRef.current = true;

      // If already shown, don't do anything
      if (hasShown) {
        return;
      }

      // Check if we've already reached the threshold
      if (totalUsage >= REQUIRED_USAGE_SECONDS) {
        await showRatingPrompt();
        await markRatingAsShown();
        hasShownRef.current = true;
        return;
      }

      // Set up AppState listener for future changes
      subscription = AppState.addEventListener('change', handleAppStateChange);

      // If app is already in foreground, start tracking immediately
      if (AppState.currentState === 'active') {
        const now = Date.now();
        await saveForegroundTimestamp(now);
        startTracking();
      }
    };

    // Initialize the hook
    initialize();

    // Cleanup on unmount
    return () => {
      isMounted = false;
      stopTracking();
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);
};

