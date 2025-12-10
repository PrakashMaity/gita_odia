import { BannerAdComponent } from '@/components/ads';
import { LockedCardOverlay, PageHeader, ProUpgradeModal } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useProStatus } from '@/hooks/useProStatus';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { LayoutImages } from '@/utils/assets';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { MangalacharanSectionCard } from '../mangalacharan/components/MangalacharanSectionCard';
import { styles } from './KrishnaMantrasScreen.styles';

export const KrishnaMantrasScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const mantras = i18n.t('krishnaMantras.mantras') as any;
  const { showAd, isLoaded } = useInterstitialAd();
  const adsShownCountRef = useRef<number>(0);
  const hasReachedEndRef = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);

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
        
        <PageHeader title={i18n.t('krishnaMantras.title')} />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          <MangalacharanSectionCard
            content={i18n.t('krishnaMantras.intro')}
            variant="intro"
          />

          {/* Render each mantra with its details */}
          {Object.keys(mantras).map((mantraKey, mantraIndex) => {
            const mantra = mantras[mantraKey];
            const isFirstMantra = mantraIndex === 0;
            const isMiddleMantra = mantraIndex === Math.floor(Object.keys(mantras).length / 2);
            
            return (
              <ThemedView key={mantraKey}>
                {isFirstMantra && (
                  <>
                    <MangalacharanSectionCard
                      titleKey={`krishnaMantras.mantras.${mantraKey}.name`}
                      content={mantra.mantraText}
                      textStyle="center"
                    />
                    {/* Banner Ad - Center */}
                    <BannerAdComponent 
                      adKey="krishna-mantras-center" 
                      containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
                    />
                  </>
                )}
                
                {!isFirstMantra && (
                  <MangalacharanSectionCard
                    titleKey={`krishnaMantras.mantras.${mantraKey}.name`}
                    content={mantra.mantraText}
                    textStyle="center"
                  />
                )}

                <MangalacharanSectionCard
                  titleKey="krishnaMantras.meaningTitle"
                  content={mantra.meaning}
                />

                {!isFirstMantra && (
                  <>
                    <LockedCardOverlay
                      isLocked={!isPro}
                      onPress={() => setShowProModal(true)}
                    >
                      <MangalacharanSectionCard
                        titleKey="krishnaMantras.niyomTitle"
                        content={mantra.niyom}
                        isList
                      />
                    </LockedCardOverlay>

                    <LockedCardOverlay
                      isLocked={!isPro}
                      onPress={() => setShowProModal(true)}
                    >
                      <MangalacharanSectionCard
                        titleKey="krishnaMantras.podhotiTitle"
                        content={mantra.podhoti}
                        isList
                      />
                    </LockedCardOverlay>

                    {mantra.benefits && (
                      <LockedCardOverlay
                        isLocked={!isPro}
                        onPress={() => setShowProModal(true)}
                      >
                        <MangalacharanSectionCard
                          titleKey="krishnaMantras.benefitsTitle"
                          content={mantra.benefits}
                          isList
                        />
                      </LockedCardOverlay>
                    )}
                  </>
                )}

                {isFirstMantra && (
                  <>
                    <MangalacharanSectionCard
                      titleKey="krishnaMantras.niyomTitle"
                      content={mantra.niyom}
                      isList
                    />

                    <MangalacharanSectionCard
                      titleKey="krishnaMantras.podhotiTitle"
                      content={mantra.podhoti}
                      isList
                    />

                    {mantra.benefits && (
                      <MangalacharanSectionCard
                        titleKey="krishnaMantras.benefitsTitle"
                        content={mantra.benefits}
                        isList
                      />
                    )}
                  </>
                )}

                {isMiddleMantra && (
                  <BannerAdComponent 
                    adKey="krishna-mantras-below-center" 
                    containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
                  />
                )}
              </ThemedView>
            );
          })}
        </ScrollView>
        <ProUpgradeModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
        />
      </ThemedView>
    </ImageBackground>
  );
};
