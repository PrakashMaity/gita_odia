import { shouldShowAds } from '@/services/adFreeService';
import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from './config/config';

interface BannerAdComponentProps {
  size?: BannerAdSize;
  requestOptions?: any;
  onAdLoaded?: (dimensions: { width: number; height: number }) => void;
  onAdFailedToLoad?: (error: Error) => void;
  onAdOpened?: () => void;
  onAdImpression?: () => void;
  onAdClicked?: () => void;
  onAdClosed?: () => void;
  onPaid?: (event: any) => void;
  onSizeChange?: (dimensions: { width: number; height: number }) => void;
}

/**
 * Banner Ad Component
 * Following official react-native-google-mobile-ads documentation
 */
export const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER,
  requestOptions,
  onAdLoaded,
  onAdFailedToLoad,
  onAdOpened,
  onAdImpression,
  onAdClicked,
  onAdClosed,
  onPaid,
  onSizeChange,
}) => {
  const bannerRef = useRef<BannerAd>(null);
  const [showAd, setShowAd] = useState(true);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);

  // Check ad-free status
  useEffect(() => {
    const checkAdFree = async () => {
      const shouldShow = await shouldShowAds();
      setShowAd(shouldShow);
    };
    checkAdFree();
    
    // Check periodically (every 30 seconds) in case ad-free status changes
    const interval = setInterval(checkAdFree, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle ad load events
  const handleAdLoaded = (dimensions: { width: number; height: number }) => {
    setAdLoaded(true);
    setAdError(null);
    onAdLoaded?.(dimensions);
    if (__DEV__) {
      console.log('Banner ad loaded successfully', dimensions);
    }
  };

  const handleAdFailedToLoad = (error: Error) => {
    setAdLoaded(false);
    setAdError(error.message);
    onAdFailedToLoad?.(error);
    
    // "no-fill" errors are expected when there's no ad inventory available
    // Only log actual errors, not no-fill scenarios
    if (__DEV__) {
      const isNoFillError = error.message?.includes('error-code-no-fill') || 
                           error.message?.includes('no ad was returned due to lack of ad inventory');
      
      if (isNoFillError) {
        // No-fill is expected behavior, use debug level instead of warn
        console.debug('Banner ad: No ad inventory available (no-fill)');
      } else {
        // Log actual errors as warnings
        console.warn('Banner ad failed to load:', error.message);
      }
    }
  };

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  if (!showAd) {
    return null;
  }

  return (
    <>
      <BannerAd
        ref={bannerRef}
        unitId={BANNER_AD_UNIT_ID}
        size={size}
        requestOptions={requestOptions}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
        onAdOpened={onAdOpened}
        onAdImpression={onAdImpression}
        onAdClicked={onAdClicked}
        onAdClosed={onAdClosed}
        onPaid={onPaid}
        onSizeChange={onSizeChange}
      />
      {__DEV__ && (
        <React.Fragment>
          {adError && (
            <React.Fragment>
              {/* Debug info - remove in production */}
            </React.Fragment>
          )}
        </React.Fragment>
      )}
    </>
  );
};

