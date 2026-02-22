// Ad Functions - Following official react-native-google-mobile-ads documentation
export {
  createInterstitialAd,
  setupInterstitialListeners,
  showInterstitialAd,
} from './interstitialAd';

export {
  createRewardedAd,
  setupRewardedListeners,
  showRewardedAd,
} from './rewardedAd';

export {
  createRewardedInterstitialAd,
  setupRewardedInterstitialListeners,
  showRewardedInterstitialAd,
} from './rewardedInterstitialAd';

export {
  createAppOpenAd,
  setupAppOpenListeners,
  showAppOpenAd,
} from './appOpenAd';

// Ad Configuration
export {
  INTERSTITIAL_AD_UNIT_ID,
  REWARDED_AD_UNIT_ID,
  REWARDED_INTERSTITIAL_AD_UNIT_ID,
} from './config/config';
