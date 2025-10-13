import { useEffect, useState } from 'react';
import { AdEventType, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';
import { REWARDED_AD_UNIT_ID } from '../config/config';

export const useRewardedAds = () => {
    const [loadedRewarded, setLoadedRewarded] = useState(false);
    const [rewarded, setRewarded] = useState<RewardedAd | null>(null);

    useEffect(() => {
      // Create new rewarded ad instance
      const newRewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
        keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
      });

      const unsubscribeLoaded = newRewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        setLoadedRewarded(true);
      });

      const unsubscribeEarned = newRewarded.addAdEventListener(
        RewardedAdEventType.EARNED_REWARD,
        reward => {
          console.log('User earned reward of ', reward);
        },
      );

      const unsubscribeClosed = newRewarded.addAdEventListener(
        AdEventType.CLOSED,
        () => {
          setLoadedRewarded(false);
          // Load new ad after closing
          newRewarded.load();
        }
      );

      const unsubscribeError = newRewarded.addAdEventListener(
        AdEventType.ERROR,
        () => {
          
          setLoadedRewarded(false);
          // Retry loading after error
          setTimeout(() => {
            newRewarded.load();
          }, 5000);
        }
      );

      setRewarded(newRewarded);
      newRewarded.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeEarned();
        unsubscribeClosed();
        unsubscribeError();
      };
    }, []);

    const showRewarded = () => {
      if (loadedRewarded && rewarded) {
        try {
          rewarded.show();
        } catch (error) {
         
          setLoadedRewarded(false);
        }
      } 
    };

    return {
        loadedRewarded,
        showRewarded
    };
};