import React, { useEffect } from 'react';
import { useInterstitialAds } from './hooks/useInterstitialAds';
import { useRewardedAds } from './hooks/useRewardedAds';
import { useRewardedInterstitialAds } from './hooks/useRewardedInterstitialAds';

interface AdsManagerProps {
  showInterstitial?: boolean;
  showRewarded?: boolean;
  showRewardedInterstitial?: boolean;
  onInterstitialClosed?: () => void;
  onRewardedEarned?: (reward: any) => void;
  onRewardedInterstitialEarned?: (reward: any) => void;
}

const AdsManager: React.FC<AdsManagerProps> = ({
  showInterstitial = false,
  showRewarded = false,
  showRewardedInterstitial = false,
  onInterstitialClosed,
  onRewardedEarned,
  onRewardedInterstitialEarned,
}) => {
  const { loadedInterstitial, showInterstitial: showInterstitialAd } = useInterstitialAds();
  const { loadedRewarded, showRewarded: showRewardedAd } = useRewardedAds();
  const { loadedRewardedInterstitial, showRewardedInterstitial: showRewardedInterstitialAd } = useRewardedInterstitialAds();

  // Auto-show interstitial if enabled
  useEffect(() => {
    if (showInterstitial && loadedInterstitial) {
      showInterstitialAd();
    }
  }, [showInterstitial, loadedInterstitial, showInterstitialAd]);

  // Auto-show rewarded if enabled
  useEffect(() => {
    if (showRewarded && loadedRewarded) {
      showRewardedAd();
    }
  }, [showRewarded, loadedRewarded, showRewardedAd]);

  // Auto-show rewarded interstitial if enabled
  useEffect(() => {
    if (showRewardedInterstitial && loadedRewardedInterstitial) {
      showRewardedInterstitialAd();
    }
  }, [showRewardedInterstitial, loadedRewardedInterstitial, showRewardedInterstitialAd]);

  return null;
};

export default AdsManager;
