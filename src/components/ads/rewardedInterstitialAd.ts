import { shouldShowAds } from '@/services/adFreeService';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import {
    AdEventType,
    RewardedAdEventType,
    RewardedInterstitialAd,
} from 'react-native-google-mobile-ads';
import { REWARDED_INTERSTITIAL_AD_UNIT_ID } from './config/config';

/**
 * Creates and loads a rewarded interstitial ad
 * Following official react-native-google-mobile-ads documentation
 * Refactored to check SDK initialization before creating ad
 */
export const createRewardedInterstitialAd = () => {
  if (!isAdsInitialized()) {
    console.warn('[RewardedInterstitialAd] SDK not initialized, ad creation may fail');
  }

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
 * Shows a rewarded interstitial ad if it's loaded and ad-free is not active
 * @param rewardedInterstitial - The rewarded interstitial ad instance
 * @param force - If true, bypasses all checks (for developer testing)
 */
export const showRewardedInterstitialAd = async (rewardedInterstitial: RewardedInterstitialAd, force: boolean = false) => {
  try {
    if (!isAdsInitialized() && !force) {
      console.warn('[RewardedInterstitialAd] SDK not initialized, cannot show ad');
      return;
    }

    if (!force) {
      const shouldShow = await shouldShowAds();
      if (!shouldShow) {
        console.log('[RewardedInterstitialAd] Ads disabled, not showing');
        return;
      }
    }

    // Check if ad is loaded before showing (if property exists)
    // Note: The show() method will handle errors if ad is not loaded
    const adLoaded = (rewardedInterstitial as any).loaded;
    if (adLoaded !== undefined && !adLoaded && !force) {
      console.warn('[RewardedInterstitialAd] Ad not loaded yet, cannot show');
      return;
    }

    rewardedInterstitial.show();
    console.log('[RewardedInterstitialAd] Ad shown successfully');
  } catch (error) {
    console.error('[RewardedInterstitialAd] Error showing ad:', error);
  }
};

