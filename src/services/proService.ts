import AsyncStorage from '@react-native-async-storage/async-storage';

const PRO_UNTIL_KEY = 'gita_pro_until';
const FIRST_APP_OPEN_KEY = 'gita_first_app_open';
const PRO_POPUP_SHOWN_KEY = 'gita_pro_popup_shown';
const PRO_POINTS_EXTENDED_KEY = 'gita_pro_points_extended';

const PRO_DAYS_DURATION = 1; // 1 day Pro duration
const PRO_POINTS_THRESHOLD = 2000; // Points needed to extend Pro

/**
 * Check if it's the first app open
 */
export async function isFirstAppOpen(): Promise<boolean> {
  try {
    const firstOpen = await AsyncStorage.getItem(FIRST_APP_OPEN_KEY);
    return firstOpen === null;
  } catch (error) {
    console.error('Error checking first app open:', error);
    return false;
  }
}

/**
 * Mark first app open as completed
 */
export async function markFirstAppOpen(): Promise<void> {
  try {
    await AsyncStorage.setItem(FIRST_APP_OPEN_KEY, 'true');
  } catch (error) {
    console.error('Error marking first app open:', error);
  }
}

/**
 * Check if Pro popup has been shown
 */
export async function hasProPopupBeenShown(): Promise<boolean> {
  try {
    const shown = await AsyncStorage.getItem(PRO_POPUP_SHOWN_KEY);
    return shown === 'true';
  } catch (error) {
    console.error('Error checking Pro popup status:', error);
    return false;
  }
}

/**
 * Mark Pro popup as shown
 */
export async function markProPopupShown(): Promise<void> {
  try {
    await AsyncStorage.setItem(PRO_POPUP_SHOWN_KEY, 'true');
  } catch (error) {
    console.error('Error marking Pro popup as shown:', error);
  }
}

/**
 * Activate Pro for 1 day (first time user)
 */
export async function activateProForFirstTime(): Promise<boolean> {
  try {
    const isFirstOpen = await isFirstAppOpen();
    if (!isFirstOpen) {
      return false; // Not first open
    }

    // Activate Pro for 15 minutes
    const proUntil = Date.now() + (15 * 60 * 1000); // 15 minutes in milliseconds
    await AsyncStorage.setItem(PRO_UNTIL_KEY, proUntil.toString());
    await markFirstAppOpen();

    return true;
  } catch (error) {
    console.error('Error activating Pro for first time:', error);
    return false;
  }
}

/**
 * Check if Pro is currently active
 */
export async function isProActive(): Promise<boolean> {
  try {
    const proUntilData = await AsyncStorage.getItem(PRO_UNTIL_KEY);
    if (!proUntilData) {
      return false;
    }

    const proUntil = parseInt(proUntilData, 10);
    return Date.now() < proUntil;
  } catch (error) {
    console.error('Error checking Pro status:', error);
    return false;
  }
}

/**
 * Get Pro status information
 */
export async function getProStatus(): Promise<{
  isActive: boolean;
  remainingTime: number; // milliseconds
  remainingDays: number;
  remainingHours: number;
  proUntil: number;
}> {
  try {
    const isActive = await isProActive();
    const proUntilData = await AsyncStorage.getItem(PRO_UNTIL_KEY);
    const proUntil = proUntilData ? parseInt(proUntilData, 10) : 0;

    const remainingTime = isActive ? Math.max(0, proUntil - Date.now()) : 0;
    const remainingDays = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
    const remainingHours = Math.floor((remainingTime % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));

    return {
      isActive,
      remainingTime,
      remainingDays,
      remainingHours,
      proUntil,
    };
  } catch (error) {
    console.error('Error getting Pro status:', error);
    return {
      isActive: false,
      remainingTime: 0,
      remainingDays: 0,
      remainingHours: 0,
      proUntil: 0,
    };
  }
}

/**
 * Mark points as redeemed (similar to removeRedeemedPointsFromShares)
 */
async function markPointsAsRedeemed(pointsToRedeem: number): Promise<void> {
  try {
    const SHARES_STORAGE_KEY = 'gita_shares_data';
    const APP_SHARES_STORAGE_KEY = 'gita_app_shares_data';
    const POINTS_PER_VERSE_SHARE = 2;
    const POINTS_PER_APP_SHARE = 10;
    const POINTS_WINDOW_DAYS = 10;

    const [verseSharesData, appSharesData] = await Promise.all([
      AsyncStorage.getItem(SHARES_STORAGE_KEY),
      AsyncStorage.getItem(APP_SHARES_STORAGE_KEY),
    ]);

    const verseShares: Array<{ timestamp: number }> = verseSharesData ? JSON.parse(verseSharesData) : [];
    const appShares: Array<{ timestamp: number }> = appSharesData ? JSON.parse(appSharesData) : [];

    const now = Date.now();
    const tenDaysAgo = now - POINTS_WINDOW_DAYS * 24 * 60 * 60 * 1000;

    // Get current window shares sorted by timestamp (oldest first)
    const currentVerseShares = verseShares
      .filter(share => share.timestamp >= tenDaysAgo)
      .sort((a, b) => a.timestamp - b.timestamp);

    const currentAppShares = appShares
      .filter(share => share.timestamp >= tenDaysAgo)
      .sort((a, b) => a.timestamp - b.timestamp);

    // Remove shares starting from oldest until we've removed enough points
    let pointsRemoved = 0;
    const sharesToRemove: { type: 'verse' | 'app'; index: number }[] = [];

    // Remove verse shares first (worth less points)
    for (let i = 0; i < currentVerseShares.length && pointsRemoved < pointsToRedeem; i++) {
      sharesToRemove.push({ type: 'verse', index: i });
      pointsRemoved += POINTS_PER_VERSE_SHARE;
    }

    // If still need more points, remove app shares
    for (let i = 0; i < currentAppShares.length && pointsRemoved < pointsToRedeem; i++) {
      sharesToRemove.push({ type: 'app', index: i });
      pointsRemoved += POINTS_PER_APP_SHARE;
    }

    // Mark shares as redeemed by storing redeemed timestamps
    const redeemedTimestampsKey = 'gita_redeemed_share_timestamps';
    const redeemedTimestampsData = await AsyncStorage.getItem(redeemedTimestampsKey);
    const redeemedTimestamps: number[] = redeemedTimestampsData ? JSON.parse(redeemedTimestampsData) : [];

    sharesToRemove.forEach(({ type, index }) => {
      const share = type === 'verse' ? currentVerseShares[index] : currentAppShares[index];
      if (share && !redeemedTimestamps.includes(share.timestamp)) {
        redeemedTimestamps.push(share.timestamp);
      }
    });

    await AsyncStorage.setItem(redeemedTimestampsKey, JSON.stringify(redeemedTimestamps));
  } catch (error) {
    console.error('Error marking points as redeemed:', error);
  }
}

/**
 * Extend Pro for 1 day using points
 */
export async function extendProWithPoints(): Promise<{ success: boolean; message: string }> {
  try {
    // Import here to avoid circular dependency
    const { getPointsData } = await import('./shareAnalyticsService');
    const pointsData = await getPointsData();

    if (pointsData.currentPoints < PRO_POINTS_THRESHOLD) {
      return {
        success: false,
        message: `You need ${PRO_POINTS_THRESHOLD} points to extend Pro. You currently have ${pointsData.currentPoints} points.`,
      };
    }

    // Check if user has already extended Pro with points
    const hasExtended = await AsyncStorage.getItem(PRO_POINTS_EXTENDED_KEY);
    if (hasExtended === 'true') {
      return {
        success: false,
        message: 'You have already extended Pro using points. Please wait for your current Pro to expire.',
      };
    }

    // Get current Pro status
    const currentProUntil = await AsyncStorage.getItem(PRO_UNTIL_KEY);
    const currentProUntilTime = currentProUntil ? parseInt(currentProUntil, 10) : Date.now();

    // Extend Pro for 1 day from current expiry (or from now if not active)
    const newProUntil = currentProUntilTime > Date.now()
      ? currentProUntilTime + (PRO_DAYS_DURATION * 24 * 60 * 60 * 1000)
      : Date.now() + (PRO_DAYS_DURATION * 24 * 60 * 60 * 1000);

    // Save new Pro expiry
    await AsyncStorage.setItem(PRO_UNTIL_KEY, newProUntil.toString());
    await AsyncStorage.setItem(PRO_POINTS_EXTENDED_KEY, 'true');

    // Deduct points by marking them as redeemed
    await markPointsAsRedeemed(PRO_POINTS_THRESHOLD);

    return {
      success: true,
      message: `Pro extended successfully for ${PRO_DAYS_DURATION} day!`,
    };
  } catch (error) {
    console.error('Error extending Pro with points:', error);
    return {
      success: false,
      message: 'Failed to extend Pro. Please try again.',
    };
  }
}

/**
 * Check if user can extend Pro with points
 */
export async function canExtendProWithPoints(): Promise<{
  canExtend: boolean;
  hasEnoughPoints: boolean;
  hasAlreadyExtended: boolean;
  currentPoints: number;
}> {
  try {
    const { getPointsData } = await import('./shareAnalyticsService');
    const pointsData = await getPointsData();
    const hasExtended = await AsyncStorage.getItem(PRO_POINTS_EXTENDED_KEY);

    return {
      canExtend: pointsData.currentPoints >= PRO_POINTS_THRESHOLD && hasExtended !== 'true',
      hasEnoughPoints: pointsData.currentPoints >= PRO_POINTS_THRESHOLD,
      hasAlreadyExtended: hasExtended === 'true',
      currentPoints: pointsData.currentPoints,
    };
  } catch (error) {
    console.error('Error checking if can extend Pro:', error);
    return {
      canExtend: false,
      hasEnoughPoints: false,
      hasAlreadyExtended: false,
      currentPoints: 0,
    };
  }
}

/**
 * Reset Pro points extension flag (for testing or if needed)
 */
export async function resetProPointsExtension(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PRO_POINTS_EXTENDED_KEY);
  } catch (error) {
    console.error('Error resetting Pro points extension:', error);
  }
}

/**
 * Activate Pro mode programmatically (for developer/testing purposes)
 * @param days - Number of days to activate Pro for (default: 30 days)
 */
export async function activateProMode(days: number = 30): Promise<{ success: boolean; message: string }> {
  try {
    // Get current Pro status
    const currentProUntil = await AsyncStorage.getItem(PRO_UNTIL_KEY);
    const currentProUntilTime = currentProUntil ? parseInt(currentProUntil, 10) : Date.now();

    // Activate Pro for specified days from current expiry (or from now if not active)
    const newProUntil = currentProUntilTime > Date.now()
      ? currentProUntilTime + (days * 24 * 60 * 60 * 1000)
      : Date.now() + (days * 24 * 60 * 60 * 1000);

    // Save new Pro expiry
    await AsyncStorage.setItem(PRO_UNTIL_KEY, newProUntil.toString());

    return {
      success: true,
      message: `Pro mode activated successfully for ${days} day(s).`,
    };
  } catch (error) {
    console.error('Error activating Pro mode:', error);
    return {
      success: false,
      message: 'Failed to activate Pro mode. Please try again.',
    };
  }
}

/**
 * Clear/Remove Pro mode (for developer/testing purposes)
 * This will remove all Pro-related data
 */
export async function clearProMode(): Promise<{ success: boolean; message: string }> {
  try {
    // Remove Pro expiry
    await AsyncStorage.removeItem(PRO_UNTIL_KEY);

    // Remove Pro points extension flag
    await AsyncStorage.removeItem(PRO_POINTS_EXTENDED_KEY);

    // Note: We don't remove FIRST_APP_OPEN_KEY or PRO_POPUP_SHOWN_KEY
    // as those are for tracking first-time user experience

    return {
      success: true,
      message: 'Pro mode cleared successfully.',
    };
  } catch (error) {
    console.error('Error clearing Pro mode:', error);
    return {
      success: false,
      message: 'Failed to clear Pro mode. Please try again.',
    };
  }
}
