// Ad Components
export { default as AdsManager } from './AdsManager';
export { default as BannerAds } from './bannerAds';

// Ad Hooks
export { useAdFrequency } from './hooks/useAdFrequency';
export { useInterstitialAds } from './hooks/useInterstitialAds';
export { useRewardedAds } from './hooks/useRewardedAds';
export { useRewardedInterstitialAds } from './hooks/useRewardedInterstitialAds';

// Ad Configuration
export {
    BANNER_AD_UNIT_ID,
    INTERSTITIAL_AD_UNIT_ID,
    REWARDED_AD_UNIT_ID,
    REWARDED_INTERSTITIAL_AD_UNIT_ID
} from './config/config';

