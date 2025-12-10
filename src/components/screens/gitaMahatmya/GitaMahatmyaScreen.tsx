import { BannerAdComponent } from '@/components/ads';
import { PageHeader } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { commonStyles } from '@/constants';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { LayoutImages } from '@/utils/assets';
import { useCallback, useEffect, useRef } from 'react';
import { Dimensions, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { MahatmyaSectionCard } from './components/MahatmyaSectionCard';

export const GitaMahatmyaScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mahatmyaText = i18n.t('gitaMahatmya.mahatmyaText');
  const benefits = i18n.t('gitaMahatmya.benefits') as string[];
  const { showAd, isLoaded } = useInterstitialAd();
  const adsShownCountRef = useRef<number>(0);
  const hasReachedEndRef = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);

  // Reset ad count when component mounts (page revisit)
  useEffect(() => {
    adsShownCountRef.current = 0;
    hasReachedEndRef.current = false;
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isAtEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isAtEnd && !hasReachedEndRef.current && adsShownCountRef.current < 2 && isLoaded) {
      hasReachedEndRef.current = true;
      adsShownCountRef.current += 1;
      
      setTimeout(() => {
        showAd();
      }, 500);
    }

    if (!isAtEnd && hasReachedEndRef.current) {
      hasReachedEndRef.current = false;
    }
  }, [showAd, isLoaded]);

  return (
    <ImageBackground
      source={LayoutImages.background2}
      style={commonStyles.screen.container}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={commonStyles.screen.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('gitaMahatmya.title')} />

        <ScrollView 
          ref={scrollViewRef}
          style={commonStyles.screen.scrollView} 
          contentContainerStyle={commonStyles.screen.scrollContent} 
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <MahatmyaSectionCard
            content={i18n.t('gitaMahatmya.intro')}
            variant="intro"
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.significanceTitle"
            content={i18n.t('gitaMahatmya.significanceText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.mahatmyaTitle"
            content={mahatmyaText}
            textStyle="center"
          />

          {/* Banner Ad - Center */}
          <BannerAdComponent 
            adKey="gita-mahatmya-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.mahatmyaMeaningTitle"
            content={i18n.t('gitaMahatmya.mahatmyaMeaningText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.benefitsTitle"
            content={benefits}
            isList
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.readingBenefitsTitle"
            content={i18n.t('gitaMahatmya.readingBenefitsText')}
          />

          {/* Banner Ad - Below Center */}
          <BannerAdComponent 
            adKey="gita-mahatmya-below-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.historicalContextTitle"
            content={i18n.t('gitaMahatmya.historicalContextText')}
          />

          <MahatmyaSectionCard
            titleKey="gitaMahatmya.spiritualSignificanceTitle"
            content={i18n.t('gitaMahatmya.spiritualSignificanceText')}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
