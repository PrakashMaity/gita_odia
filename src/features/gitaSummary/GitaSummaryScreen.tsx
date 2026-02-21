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
import { ConclusionCard } from './components/ConclusionCard';
import { SectionCard } from './components/SectionCard';
import { SummaryCard } from './components/SummaryCard';
import { styles } from './GitaSummaryScreen.styles';
import { useGitaSummaryData } from './hooks/useGitaSummaryData';

export const GitaSummaryScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const { summaryData, teachings } = useGitaSummaryData();
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
    const paddingToBottom = 20; // Threshold for detecting end of scroll
    const isAtEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    // Only show ad if we've reached the end, haven't shown it yet for this scroll, and haven't shown 2 ads
    if (isAtEnd && !hasReachedEndRef.current && adsShownCountRef.current < 2 && isLoaded) {
      hasReachedEndRef.current = true;
      adsShownCountRef.current += 1;
      
      // Show ad after a short delay
      setTimeout(() => {
        showAd();
      }, 500);
    }

    // Reset the flag when user scrolls back up
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
        
        <PageHeader title={i18n.t('gitaSummary.title')} />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <SectionCard
            content={i18n.t('gitaSummary.intro')}
            variant="intro"
          />

          <SectionCard
            titleKey="gitaSummary.significanceTitle"
            content={i18n.t('gitaSummary.significanceText')}
          />

          <SectionCard
            titleKey="gitaSummary.structureTitle"
            content={i18n.t('gitaSummary.structureText')}
          />

          {/* Banner Ad - Center */}
          <BannerAdComponent 
            adKey="gita-summary-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <SectionCard
            titleKey="gitaSummary.importanceTitle"
            content={i18n.t('gitaSummary.importanceText')}
          />

          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              chapter={item.chapter}
              title={item.title}
              summary={item.summary}
            />
          ))}

          {/* Banner Ad - Below Center */}
          <BannerAdComponent 
            adKey="gita-summary-below-center" 
            containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
          />

          <ConclusionCard
            titleKey="gitaSummary.teachingsTitle"
            teachings={teachings}
          />
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
