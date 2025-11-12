import React, { useRef } from 'react';
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

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  return (
    <BannerAd
      ref={bannerRef}
      unitId={BANNER_AD_UNIT_ID}
      size={size}
      requestOptions={requestOptions}
      onAdLoaded={onAdLoaded}
      onAdFailedToLoad={onAdFailedToLoad}
      onAdOpened={onAdOpened}
      onAdImpression={onAdImpression}
      onAdClicked={onAdClicked}
      onAdClosed={onAdClosed}
      onPaid={onPaid}
      onSizeChange={onSizeChange}
    />
  );
};

