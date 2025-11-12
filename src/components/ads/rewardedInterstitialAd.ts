import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
} from 'react-native-google-mobile-ads';
import { REWARDED_INTERSTITIAL_AD_UNIT_ID } from './config/config';

/**
 * Creates and loads a rewarded interstitial ad
 * Following official react-native-google-mobile-ads documentation
 */
export const createRewardedInterstitialAd = () => {
  const rewardedInterstitial = RewardedInterstitialAd.createForAdRequest(
    REWARDED_INTERSTITIAL_AD_UNIT_ID,
    {
      keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
    }
  );

  return rewardedInterstitial;
};

/**
 * Sets up event listeners for a rewarded interstitial ad
 * Returns cleanup function to unsubscribe from events
 */
export const setupRewardedInterstitialListeners = (
  rewardedInterstitial: RewardedInterstitialAd,
  callbacks?: {
    onLoaded?: () => void;
    onEarnedReward?: (reward: any) => void;
    onClosed?: () => void;
    onError?: (error: any) => void;
  }
) => {
  const unsubscribeLoaded = rewardedInterstitial.addAdEventListener(
    RewardedAdEventType.LOADED,
    () => {
      callbacks?.onLoaded?.();
    }
  );

  const unsubscribeEarned = rewardedInterstitial.addAdEventListener(
    RewardedAdEventType.EARNED_REWARD,
    (reward) => {
      callbacks?.onEarnedReward?.(reward);
    }
  );

  const unsubscribeClosed = rewardedInterstitial.addAdEventListener(
    AdEventType.CLOSED,
    () => {
      callbacks?.onClosed?.();
    }
  );

  const unsubscribeError = rewardedInterstitial.addAdEventListener(
    AdEventType.ERROR,
    (error) => {
      callbacks?.onError?.(error);
    }
  );

  return () => {
    unsubscribeLoaded();
    unsubscribeEarned();
    unsubscribeClosed();
    unsubscribeError();
  };
};

/**
 * Shows a rewarded interstitial ad if it's loaded
 */
export const showRewardedInterstitialAd = (rewardedInterstitial: RewardedInterstitialAd) => {
  try {
    rewardedInterstitial.show();
  } catch (error) {
    console.log('Error showing rewarded interstitial ad:', error);
  }
};

