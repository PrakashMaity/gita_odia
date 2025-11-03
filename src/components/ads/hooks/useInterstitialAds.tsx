import { useEffect, useState } from 'react';
import { Platform, StatusBar } from 'react-native';
import { AdEventType, InterstitialAd } from 'react-native-google-mobile-ads';
import { INTERSTITIAL_AD_UNIT_ID } from '../config/config';

export const useInterstitialAds = () => {
    const [loadedInterstitial, setLoadedInterstitial] = useState(false);
    const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);

    useEffect(() => {
      // Create new interstitial ad instance
      const newInterstitial = InterstitialAd.createForAdRequest(INTERSTITIAL_AD_UNIT_ID, {
        keywords: ['spiritual', 'religion', 'hinduism', 'bhagavad-gita'],
      });

      const unsubscribeLoaded = newInterstitial.addAdEventListener(AdEventType.LOADED, () => {
        setLoadedInterstitial(true);
      });

      const unsubscribeOpened = newInterstitial.addAdEventListener(AdEventType.OPENED, () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(true);
        }
      });

      const unsubscribeClosed = newInterstitial.addAdEventListener(AdEventType.CLOSED, () => {
        if (Platform.OS === 'ios') {
          StatusBar.setHidden(false);
        }
        // Reset loaded state and create new ad after closing
        setLoadedInterstitial(false);
        newInterstitial.load();
      });

      const unsubscribeError = newInterstitial.addAdEventListener(AdEventType.ERROR, (error) => {
        
        setLoadedInterstitial(false);
        // Retry loading after error
        setTimeout(() => {
          newInterstitial.load();
        }, 5000);
      });

      setInterstitial(newInterstitial);
      newInterstitial.load();

      return () => {
        unsubscribeLoaded();
        unsubscribeOpened();
        unsubscribeClosed();
        unsubscribeError();
      };
    }, []);

    const showInterstitial = () => {
      if (loadedInterstitial && interstitial) {
        try {
          interstitial.show();
        } catch (error) {
          console.log('Error showing interstitial:', error);
          setLoadedInterstitial(false);
        }
      } 
    };

    return {
        loadedInterstitial,
        showInterstitial
    };
};