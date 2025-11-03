import { useEffect, useState } from 'react';
import {
  AdEventType,
  RewardedAdEventType,
  RewardedInterstitialAd,
} from 'react-native-google-mobile-ads';
import { REWARDED_INTERSTITIAL_AD_UNIT_ID } from '../config/config';

export const useRewardedInterstitialAds = () => {
    const [loadedRewardedInterstitial, setLoadedRewardedInterstitial] = useState(false);
    const [rewardedInterstitial, setRewardedInterstitial] = useState<RewardedInterstitialAd | null>(null);

  useEffect(() => {
    // Create new rewarded interstitial ad instance
    const newRewardedInterstitial = RewardedInterstitialAd.createForAdRequest(REWARDED_INTERSTITIAL_AD_UNIT_ID, {
      keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
    });

    const unsubscribeLoaded = newRewardedInterstitial.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setLoadedRewardedInterstitial(true);
      },
    );

    const unsubscribeEarned = newRewardedInterstitial.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      reward => {
        console.log('User earned reward of ', reward);
      },
    );

    const unsubscribeClosed = newRewardedInterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        setLoadedRewardedInterstitial(false);
        // Load new ad after closing
        newRewardedInterstitial.load();
      }
    );

    const unsubscribeError = newRewardedInterstitial.addAdEventListener(
      AdEventType.ERROR,
      (error) => {
       
        setLoadedRewardedInterstitial(false);
        // Retry loading after error
        setTimeout(() => {
          newRewardedInterstitial.load();
        }, 5000);
      }
    );

    setRewardedInterstitial(newRewardedInterstitial);
    newRewardedInterstitial.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeEarned();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  const showRewardedInterstitial = () => {
    if (loadedRewardedInterstitial && rewardedInterstitial) {
      try {
        rewardedInterstitial.show();
      } catch (error) {
        console.log('Error showing rewarded interstitial ad:', error);
        setLoadedRewardedInterstitial(false);
      }
    } else {
      console.log('Rewarded interstitial ad not loaded yet');
    }
  };

  return {
        loadedRewardedInterstitial,
        showRewardedInterstitial
    };
};