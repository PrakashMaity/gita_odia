import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { shouldShowAds } from '@/services/adFreeService';
import { isAdsInitialized } from '@/services/ads/initializeAds';
import { useSettingsStore } from '@/store/settingsStore';
import React, { useEffect, useRef, useState } from 'react';
import { Platform, ViewStyle } from 'react-native';
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
  adKey?: string; // Unique key for multiple banner ads on same page
  containerStyle?: ViewStyle; // Optional container style with spacing
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
  adKey,
  containerStyle,
}) => {
  const bannerRef = useRef<BannerAd>(null);
  const [showAd, setShowAd] = useState(false); // Start with false, wait for checks
  const [isSDKReady, setIsSDKReady] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [adError, setAdError] = useState<string | null>(null);
  const [hasPermanentlyFailed, setHasPermanentlyFailed] = useState(false);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  const adLoadedRef = useRef<boolean>(false); // Track loaded state in ref for timeout checks
  const { settings } = useSettingsStore();

  // Debug: Log ad state changes (only in development)
  useEffect(() => {
    if (__DEV__) {
      console.log('[BannerAd] State update', { 
        adKey: adKey || 'default', 
        showAd, 
        adLoaded, 
        adError: adError?.substring(0, 50) 
      });
    }
  }, [showAd, adLoaded, adError, adKey]);

  // Check SDK initialization
  useEffect(() => {
    const checkSDK = () => {
      const initialized = isAdsInitialized();
      setIsSDKReady(initialized);
      
      if (!initialized && !force) {
        // Retry checking SDK initialization
        const timeout = setTimeout(() => {
          checkSDK();
        }, 1000);
        return () => clearTimeout(timeout);
      }
    };
    
    checkSDK();
  }, [force]);

  // Log component mount
  useEffect(() => {
    if (__DEV__) {
      console.log('[BannerAd] Component mounted', { 
        unitId: BANNER_AD_UNIT_ID?.substring(0, 30) + '...',
        size,
        force,
        adKey: adKey || 'default'
      });
    }
  }, [size, force, adKey]);

  // Check ad status - determine if ads should be shown
  useEffect(() => {
    if (!isSDKReady && !force) {
      return;
    }

    if (force) {
      setShowAd(true);
      return;
    }

    const checkAdStatus = async () => {
      try {
        const shouldShow = await shouldShowAds();
        if (__DEV__) {
          console.log('[BannerAd] shouldShowAds result:', shouldShow, { adKey: adKey || 'default' });
        }
        setShowAd(shouldShow);
        
        // Set a timeout to hide the ad if it doesn't load within 15 seconds
        if (shouldShow && !hasPermanentlyFailed) {
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
          loadTimeoutRef.current = setTimeout(() => {
            // Check if ad still hasn't loaded using ref
            if (!adLoadedRef.current) {
              setHasPermanentlyFailed(true);
              if (__DEV__) {
                console.log('[BannerAd] Ad did not load within timeout, hiding component', { adKey: adKey || 'default' });
              }
            }
          }, 15000); // 15 seconds timeout
        }
      } catch (error) {
        console.error('[BannerAd] Error checking ad status:', error);
        // Default to showing ads if there's an error (fail open)
        setShowAd(true);
      }
    };
    
    // Check immediately
    checkAdStatus();
    
    // Re-check when developer mode changes
    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [force, settings.developerMode, isSDKReady, adKey, hasPermanentlyFailed]);

  // Handle ad load events
  const handleAdLoaded = (dimensions: { width: number; height: number }) => {
    setAdLoaded(true);
    adLoadedRef.current = true; // Update ref
    setAdError(null);
    setHasPermanentlyFailed(false); // Reset failure state on successful load
    retryCountRef.current = 0; // Reset retry count on successful load
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
    onAdLoaded?.(dimensions);
    if (__DEV__) {
      console.log('[BannerAd] Ad loaded successfully', dimensions, { adKey: adKey || 'default' });
    }
  };

  const handleAdFailedToLoad = (error: Error) => {
    setAdLoaded(false);
    adLoadedRef.current = false; // Update ref
    setAdError(error.message);
    onAdFailedToLoad?.(error);
    
    // "no-fill" errors are expected when there's no ad inventory available
    // Only log actual errors, not no-fill scenarios
    const isNoFillError = error.message?.includes('error-code-no-fill') || 
                         error.message?.includes('no ad was returned due to lack of ad inventory') ||
                         error.message?.includes('No fill') ||
                         error.message?.toLowerCase().includes('no-fill');
    
    if (isNoFillError) {
      // No-fill is expected behavior - mark as permanently failed to hide empty space
      setHasPermanentlyFailed(true);
      if (__DEV__) {
        console.debug('[BannerAd] No ad inventory available (no-fill) - hiding component', { adKey: adKey || 'default' });
      }
      // Clear any existing timeouts
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = null;
      }
    } else {
      // Log actual errors as warnings
      console.warn('[BannerAd] Failed to load:', error.message, { adKey: adKey || 'default' });
      // For non-no-fill errors, wait a bit before marking as failed (might be temporary network issue)
      // Clear any existing retry timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      // Mark as failed after a short delay if still not loaded
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      loadTimeoutRef.current = setTimeout(() => {
        // Check using ref to avoid stale closure
        if (!adLoadedRef.current) {
          setHasPermanentlyFailed(true);
          if (__DEV__) {
            console.log('[BannerAd] Ad failed to load after error - hiding component', { adKey: adKey || 'default' });
          }
        }
      }, 5000); // Wait 5 seconds after error before hiding
    }
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, []);

  // (iOS) WKWebView can terminate if app is in a "suspended state", resulting in an empty banner when app returns to foreground.
  // BannerAd component handles this automatically, but we can force a remount by changing the key
  useForeground(() => {
    if (Platform.OS === 'ios' && showAd) {
      if (__DEV__) {
        console.log('[BannerAd] App foregrounded - BannerAd will automatically reload', { adKey: adKey || 'default' });
      }
      // BannerAd component automatically handles reloading on foreground
    }
  });

  // Determine if we should render the ad
  const shouldRender = showAd && (isSDKReady || force) && !hasPermanentlyFailed;

  // Don't render if ads shouldn't be shown or SDK not ready
  if (!shouldRender) {
    if (__DEV__) {
      if (!showAd) {
        console.log('[BannerAd] Not showing ad (shouldShowAds returned false or SDK not ready)', { adKey: adKey || 'default' });
      } else if (!isSDKReady && !force) {
        console.log('[BannerAd] Waiting for SDK initialization', { adKey: adKey || 'default' });
      } else if (hasPermanentlyFailed) {
        console.log('[BannerAd] Ad permanently failed - not rendering to avoid empty space', { adKey: adKey || 'default' });
      }
    }
    return null;
  }

  // Always render BannerAd component - let it handle SDK initialization internally
  // The component will gracefully handle errors if SDK isn't ready yet
  if (__DEV__) {
    console.log('[BannerAd] Rendering BannerAd component', { 
      unitId: BANNER_AD_UNIT_ID?.substring(0, 30) + '...',
      size,
      adKey: adKey || 'default'
    });
  }
  
  const bannerAd = (
    <BannerAd
      key={adKey || `banner-ad-${Math.random()}`} // Use key to differentiate multiple banner ads
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

  // If container style is provided, wrap in ThemedView
  // This ensures spacing is only applied when ad is actually rendered
  if (containerStyle) {
    return (
      <ThemedView style={containerStyle}>
        {bannerAd}
      </ThemedView>
    );
  }

  return bannerAd;
};

