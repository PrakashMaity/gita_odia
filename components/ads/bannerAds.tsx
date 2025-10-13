import { SIZES } from '@/constants/sizes';
import React, { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { BannerAd, BannerAdSize, useForeground } from 'react-native-google-mobile-ads';
import { BANNER_AD_UNIT_ID } from './config/config';

interface BannerAdsProps {
  containerStyle?: any;
}

const BannerAds: React.FC<BannerAdsProps> = ({ containerStyle }) => {
  const bannerRef = useRef<BannerAd>(null);
  
  useForeground(() => {
    Platform.OS === 'ios' && bannerRef.current?.load();
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <BannerAd
        ref={bannerRef}
        unitId={BANNER_AD_UNIT_ID}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.spacing.sm,
  },
});

export default BannerAds;
