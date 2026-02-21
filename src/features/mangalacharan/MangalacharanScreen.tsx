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
import { MangalacharanSectionCard } from './components/MangalacharanSectionCard';
import { styles } from './MangalacharanScreen.styles';

export const MangalacharanScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mangalacharanText = i18n.t('mangalacharan.mantraText');
  const meaningText = i18n.t('mangalacharan.meaningText');
  const instructions = i18n.t('mangalacharan.instructions') as string[];
  const benefits = i18n.t('mangalacharan.benefits') as string[];
  const mantraBreakdown = i18n.t('mangalacharan.mantraBreakdown') as any;
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
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={i18n.t('mangalacharan.title')} />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <MangalacharanSectionCard
            content={i18n.t('mangalacharan.intro')}
            variant="intro"
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.significanceTitle"
            content={i18n.t('mangalacharan.significanceText')}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.mantraTitle"
            content={mangalacharanText}
            textStyle="center"
          />

          {/* Banner Ad - Center */}
          <BannerAdComponent 
            adKey="mangalacharan-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.mantraBreakdownTitle"
            content=""
            isBreakdown
            breakdownData={mantraBreakdown}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.meaningTitle"
            content={meaningText}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.benefitsTitle"
            content={benefits}
            isList
          />

          {/* Banner Ad - Below Center */}
          <BannerAdComponent 
            adKey="mangalacharan-below-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.historicalContextTitle"
            content={i18n.t('mangalacharan.historicalContextText')}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.spiritualSignificanceTitle"
            content={i18n.t('mangalacharan.spiritualSignificanceText')}
          />

          <MangalacharanSectionCard
            titleKey="mangalacharan.instructionsTitle"
            content={instructions}
            isList
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
