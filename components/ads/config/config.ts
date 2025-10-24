import Constants from 'expo-constants';
import { TestIds } from "react-native-google-mobile-ads";

// Get ad unit IDs from environment variables
const BANNER_AD_UNIT_ID = __DEV__ ? TestIds.BANNER : (Constants.expoConfig?.extra?.BANNER_AD_UNIT_ID || 'ca-app-pub-3940256099942544/6300978111');
const INTERSTITIAL_AD_UNIT_ID = __DEV__ ? TestIds.INTERSTITIAL : (Constants.expoConfig?.extra?.INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-3940256099942544/1033173712');
const REWARDED_AD_UNIT_ID = __DEV__ ? TestIds.REWARDED : (Constants.expoConfig?.extra?.REWARDED_AD_UNIT_ID || 'ca-app-pub-3940256099942544/5224354917');
const REWARDED_INTERSTITIAL_AD_UNIT_ID = __DEV__ ? TestIds.REWARDED_INTERSTITIAL : (Constants.expoConfig?.extra?.REWARDED_INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-3940256099942544/5354046379');

export { BANNER_AD_UNIT_ID, INTERSTITIAL_AD_UNIT_ID, REWARDED_AD_UNIT_ID, REWARDED_INTERSTITIAL_AD_UNIT_ID };
