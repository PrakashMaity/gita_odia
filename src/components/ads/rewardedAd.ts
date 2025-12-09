import { shouldShowAds } from '@/services/adFreeService';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import { AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from './config/config';

/**
 * Creates and loads a rewarded ad
 * Following official react-native-google-mobile-ads documentation
 * Refactored to check SDK initialization before creating ad
 */
export const createRewardedAd = () => {
  if (!isAdsInitialized()) {
    console.warn('[RewardedAd] SDK not initialized, ad creation may fail');
  }

  const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
    keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
  });

  return rewarded;
};

/**
 * Sets up event listeners for a rewarded ad
 * Returns cleanup function to unsubscribe from events
 */
export const setupRewardedListeners = (
  rewarded: RewardedAd,
  callbacks?: {
    onLoaded?: () => void;
    onEarnedReward?: (reward: any) => void;
    onClosed?: () => void;
    onError?: (error: any) => void;
  }
) => {
  const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
    callbacks?.onLoaded?.();
  });

  const unsubscribeEarned = rewarded.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      callbacks?.onEarnedReward?.(reward);
    }
  );

  const unsubscribeClosed = rewarded.addAdEventListener(AdEventType.CLOSED, () => {
    callbacks?.onClosed?.();
  });

  const unsubscribeError = rewarded.addAdEventListener(AdEventType.ERROR, (error) => {
    callbacks?.onError?.(error);
  });

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
    unsubscribeClosed();
    unsubscribeError();
  };
};

/**
 * Shows a rewarded ad if it's loaded and ad-free is not active
 * @param rewarded - The rewarded ad instance
 * @param force - If true, bypasses all checks (for developer testing)
 */
export const showRewardedAd = async (rewarded: RewardedAd, force: boolean = false) => {
  try {
    if (!isAdsInitialized() && !force) {
      console.warn('[RewardedAd] SDK not initialized, cannot show ad');
      return;
    }

    if (!force) {
      const shouldShow = await shouldShowAds();
      if (!shouldShow) {
        console.log('[RewardedAd] Ads disabled, not showing');
        return;
      }
    }

    // Check if ad is loaded before showing (if property exists)
    // Note: The show() method will handle errors if ad is not loaded
    const adLoaded = (rewarded as any).loaded;
    if (adLoaded !== undefined && !adLoaded && !force) {
      console.warn('[RewardedAd] Ad not loaded yet, cannot show');
      return;
    }

    rewarded.show();
    console.log('[RewardedAd] Ad shown successfully');
  } catch (error) {
    console.error('[RewardedAd] Error showing ad:', error);
  }
};

