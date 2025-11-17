import { AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from './config/config';
import { shouldShowAds } from '@/services/adFreeService';

/**
 * Creates and loads a rewarded ad
 * Following official react-native-google-mobile-ads documentation
 */
export const createRewardedAd = () => {
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
 */
export const showRewardedAd = async (rewarded: RewardedAd) => {
  try {
    const shouldShow = await shouldShowAds();
    if (!shouldShow) {
      return;
    }
    rewarded.show();
  } catch (error) {
    console.error('Error showing rewarded ad:', error);
  }
};

