import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useInterstitialAds } from './hooks/useInterstitialAds';
import { useRewardedAds } from './hooks/useRewardedAds';
import { useRewardedInterstitialAds } from './hooks/useRewardedInterstitialAds';

const AdDebugger = () => {
  const { loadedInterstitial } = useInterstitialAds();
  const { loadedRewarded } = useRewardedAds();
  const { loadedRewardedInterstitial } = useRewardedInterstitialAds();

  if (__DEV__) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Ad Status:</Text>
        <Text style={styles.text}>Interstitial: {loadedInterstitial ? '✅' : '❌'}</Text>
        <Text style={styles.text}>Rewarded: {loadedRewarded ? '✅' : '❌'}</Text>
        <Text style={styles.text}>Rewarded Interstitial: {loadedRewardedInterstitial ? '✅' : '❌'}</Text>
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
    borderRadius: 4,
    zIndex: 9999,
  },
  text: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'monospace',
  },
});

export default AdDebugger;
