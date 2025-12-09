import { shouldShowAds } from '@/services/adFreeService';
import { useSettingsStore } from '@/store/settingsStore';
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
  force?: boolean; // If true, bypasses all checks (for developer testing)
}

/**
 * Banner Ad Component
 * Following official react-native-google-mobile-ads documentation
 * Refactored to properly handle SDK initialization and ad status checks
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
  force = false,
}) => {
  const bannerRef = useRef<BannerAd>(null);
  const [showAd, setShowAd] = useState(true); // Start with true to allow rendering
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const { settings } = useSettingsStore();

  // Debug: Log ad state changes
  useEffect(() => {
    console.log('[BannerAd] State update', { showAd, adLoaded, adError: adError?.substring(0, 50) });
  }, [showAd, adLoaded, adError]);

  // Log component mount
  useEffect(() => {
    console.log('[BannerAd] Component mounted', { 
      unitId: BANNER_AD_UNIT_ID?.substring(0, 30) + '...',
      size,
      force 
    });
  }, [size, force]);

  // Check ad status - determine if ads should be shown
  useEffect(() => {
    if (force) {
      setShowAd(true);
      return;
    }

    const checkAdStatus = async () => {
      try {
        const shouldShow = await shouldShowAds();
        console.log('[BannerAd] shouldShowAds result:', shouldShow);
        setShowAd(shouldShow);
      } catch (error) {
        console.error('[BannerAd] Error checking ad status:', error);
        // Default to showing ads if there's an error (fail open)
        setShowAd(true);
      }
    };
    
    // Check immediately
    checkAdStatus();
    
    // Re-check when developer mode changes
  }, [force, settings.developerMode]);

  // Handle ad load events
  const handleAdLoaded = (dimensions: { width: number; height: number }) => {
    setAdLoaded(true);
    setAdError(null);
    onAdLoaded?.(dimensions);
    console.log('[BannerAd] Ad loaded successfully', dimensions);
  };

  const handleAdFailedToLoad = (error: Error) => {
    setAdLoaded(false);
    setAdError(error.message);
    onAdFailedToLoad?.(error);
    
    // "no-fill" errors are expected when there's no ad inventory available
    // Only log actual errors, not no-fill scenarios
    const isNoFillError = error.message?.includes('error-code-no-fill') || 
                         error.message?.includes('no ad was returned due to lack of ad inventory') ||
                         error.message?.includes('No fill') ||
                         error.message?.toLowerCase().includes('no-fill');
    
    if (isNoFillError) {
      // No-fill is expected behavior, use debug level instead of warn
      console.debug('[BannerAd] No ad inventory available (no-fill)');
    } else {
      // Log actual errors as warnings
      console.warn('[BannerAd] Failed to load:', error.message);
    }
  };

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // Therefore it's advised to "manually" request a new ad when the app is foregrounded
  useForeground(() => {
    if (Platform.OS === 'ios' && showAd && bannerRef.current) {
      console.log('[BannerAd] App foregrounded, reloading ad...');
      bannerRef.current.load();
    }
  });

  // Don't render if ads shouldn't be shown
  if (!showAd) {
    console.log('[BannerAd] Not showing ad (shouldShowAds returned false)');
    return null;
  }

  // Always render BannerAd component - let it handle SDK initialization internally
  // The component will gracefully handle errors if SDK isn't ready yet
  console.log('[BannerAd] Rendering BannerAd component', { 
    unitId: BANNER_AD_UNIT_ID?.substring(0, 30) + '...',
    size 
  });
  
  return (
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
  );
};

