import { useCallback, useState } from 'react';
import { useInterstitialAds } from './useInterstitialAds';
import { useRewardedAds } from './useRewardedAds';

interface AdFrequencyConfig {
  interstitialInterval: number; // Show interstitial every N actions
  rewardedCooldown: number; // Cooldown for rewarded ads in minutes
  maxAdsPerSession: number; // Maximum ads per session
}

const defaultConfig: AdFrequencyConfig = {
  interstitialInterval: 3, // Show interstitial every 2-3 slokas
  rewardedCooldown: 5, // 5 minutes cooldown for rewarded ads
  maxAdsPerSession: 15, // Max 15 ads per session (increased for more slokas)
};

export const useAdFrequency = (config: Partial<AdFrequencyConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config };
  const [actionCount, setActionCount] = useState(0);
  const [sessionAdCount, setSessionAdCount] = useState(0);
  const [lastRewardedTime, setLastRewardedTime] = useState<number>(0);
  
  const { loadedInterstitial, showInterstitial } = useInterstitialAds();
  const { loadedRewarded, showRewarded } = useRewardedAds();

  const incrementAction = useCallback(() => {
    setActionCount(prev => prev + 1);
  }, []);

  const shouldShowInterstitial = useCallback(() => {
    return (
      loadedInterstitial &&
      actionCount > 0 &&
      actionCount % finalConfig.interstitialInterval === 0 &&
      sessionAdCount < finalConfig.maxAdsPerSession
    );
  }, [loadedInterstitial, actionCount, finalConfig.interstitialInterval, sessionAdCount, finalConfig.maxAdsPerSession]);

  const shouldShowRewarded = useCallback(() => {
    const now = Date.now();
    const timeSinceLastRewarded = (now - lastRewardedTime) / (1000 * 60); // Convert to minutes
    
    return (
      loadedRewarded &&
      timeSinceLastRewarded >= finalConfig.rewardedCooldown &&
      sessionAdCount < finalConfig.maxAdsPerSession
    );
  }, [loadedRewarded, lastRewardedTime, finalConfig.rewardedCooldown, sessionAdCount, finalConfig.maxAdsPerSession]);

  const showInterstitialIfReady = useCallback(() => {
   
    
    if (shouldShowInterstitial()) {
    
      showInterstitial();
      setSessionAdCount(prev => prev + 1);
      return true;
    } else if (loadedInterstitial) {
     
      showInterstitial();
      setSessionAdCount(prev => prev + 1);
      return true;
    } else {
    
    }
    return false;
  }, [shouldShowInterstitial, showInterstitial, loadedInterstitial,]);

  const showRewardedIfReady = useCallback(() => {
    if (shouldShowRewarded()) {
      showRewarded();
      setLastRewardedTime(Date.now());
      setSessionAdCount(prev => prev + 1);
      return true;
    }
    return false;
  }, [shouldShowRewarded, showRewarded]);

  const resetSession = useCallback(() => {
    setActionCount(0);
    setSessionAdCount(0);
  }, []);
  return {
    incrementAction,
    showInterstitialIfReady,
    showRewardedIfReady,
    shouldShowInterstitial: shouldShowInterstitial(),
    shouldShowRewarded: shouldShowRewarded(),
    actionCount,
    sessionAdCount,
    resetSession,
  };
};
