import { BannerAdComponent } from '@/components/ads';
import { PageHeader } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import i18n from '@/lib/i18n';
import { WavePattern } from '@/lib/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { LayoutImages } from '@/lib/utils/assets';
import { useCallback, useEffect, useRef } from 'react';
import { Dimensions, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { DhyanaSectionCard } from './components/DhyanaSectionCard';
import { styles } from './DhyanaScreen.styles';

export const DhyanaScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const dhyanaText = i18n.t('dhyana.slokaText');
  const meaningText = i18n.t('dhyana.meaningText');
  const benefits = i18n.t('dhyana.benefits') as string[];
  const steps = i18n.t('dhyana.steps') as string[];
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
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('dhyana.title')} showBackButton={true} />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <DhyanaSectionCard
            titleKey="dhyana.introTitle"
            content={i18n.t('dhyana.introText')}
            variant="intro"
          />

          <DhyanaSectionCard
            titleKey="dhyana.significanceTitle"
            content={i18n.t('dhyana.significanceText')}
          />

          <DhyanaSectionCard
            titleKey="dhyana.slokaTitle"
            content={dhyanaText}
          />

          {/* Banner Ad - Center */}
          <BannerAdComponent 
            adKey="dhyana-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <DhyanaSectionCard
            titleKey="dhyana.slokaMeaningTitle"
            content={i18n.t('dhyana.slokaMeaningText')}
          />

          <DhyanaSectionCard
            titleKey="dhyana.meaningTitle"
            content={meaningText}
          />

          <DhyanaSectionCard
            titleKey="dhyana.benefitsTitle"
            content={benefits}
            isList
            listType="bullet"
          />

          <DhyanaSectionCard
            titleKey="dhyana.typesTitle"
            content={i18n.t('dhyana.typesText')}
          />

          {/* Banner Ad - Below Center */}
          <BannerAdComponent 
            adKey="dhyana-below-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <DhyanaSectionCard
            titleKey="dhyana.stepsTitle"
            content={steps}
            isList
            listType="numbered"
          />

          <DhyanaSectionCard
            titleKey="dhyana.tipsTitle"
            content={i18n.t('dhyana.tipsText')}
          />

          <DhyanaSectionCard
            titleKey="dhyana.historicalContextTitle"
            content={i18n.t('dhyana.historicalContextText')}
          />

          <DhyanaSectionCard
            titleKey="dhyana.spiritualSignificanceTitle"
            content={i18n.t('dhyana.spiritualSignificanceText')}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
