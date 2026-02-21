import { BannerAdComponent } from '@/components/ads';
import { LoadingState, PageHeader } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useTranslationStore } from '@/store';
import { LayoutImages } from '@/lib/utils/assets';
import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, NativeScrollEvent, NativeSyntheticEvent, ScrollView, TouchableOpacity } from 'react-native';
import { AudioModal } from './components/AudioModal';
import { ErrorState } from './components/ErrorState';
import { TranslationMessage } from './components/TranslationMessage';
import { styles } from './TranslationDetailScreen.styles';

export const TranslationDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTranslationById, isLoading } = useTranslationStore();
  const { theme } = useTheme();
  const [isFullChapterAudioModalVisible, setIsFullChapterAudioModalVisible] = useState(false);
  const { showAd, isLoaded } = useInterstitialAd();
  const adsShownCountRef = useRef<number>(0);
  const hasReachedEndRef = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  const translationData = id ? getTranslationById(id) : null;

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

  // Prepare full chapter verses for audio with speaker-specific voices
  const fullChapterVerses = useMemo(() => {
    if (!translationData?.verses) return [];
    
    return translationData.verses.map((verse) => ({
      text: verse.translation,
      speakerEnglish: verse.speaker_english,
    }));
  }, [translationData?.verses]);

  if (isLoading) {
    return <LoadingState message={i18n.t('common.loading')} />;
  }

  if (!translationData) {
    return <ErrorState />;
  }

  const { chapter, verses } = translationData;

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader
          title={`${chapter.title} || ${chapter.subtitle}`}
          rightAction={
            <TouchableOpacity
              onPress={() => setIsFullChapterAudioModalVisible(true)}
              style={[
                styles.headerAudioButton,
                { backgroundColor: theme.background.quaternary },
              ]}
            >
              <MaterialIcons
                name="volume-down"
                size={SIZES.icon.md}
                color={theme.icon.tertiary}
              />
            </TouchableOpacity>
          }
        />

        <ScrollView 
          ref={scrollViewRef}
          style={styles.chatContainer} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.chatContent}
          onScroll={handleScroll}
          scrollEventThrottle={400}
        >
          {verses?.map((verse, index) => {
            const totalVerses = verses?.length || 0;
            const middleIndex = Math.floor(totalVerses / 2);
            const isCenterPosition = index === middleIndex;
            const isBelowCenterPosition = index === Math.floor(totalVerses * 0.75);
            
            return (
              <ThemedView key={verse.id}>
                <TranslationMessage
                  verse={verse}
                  index={index}
                  shouldShowBanner={(index + 1) % 4 === 0}
                  chapterId={chapter.id}
                  chapterNumber={chapter.number}
                />
                {isCenterPosition && (
                  <BannerAdComponent 
                    adKey={`translation-detail-center-${chapter.id}`} 
                    containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
                  />
                )}
                {isBelowCenterPosition && (
                  <BannerAdComponent 
                    adKey={`translation-detail-below-center-${chapter.id}`} 
                    containerStyle={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg, marginBottom: SIZES.spacing.lg }}
                  />
                )}
              </ThemedView>
            );
          })}
        </ScrollView>

        {/* Full Chapter Audio Modal */}
        <AudioModal
          visible={isFullChapterAudioModalVisible}
          onClose={() => setIsFullChapterAudioModalVisible(false)}
          verses={fullChapterVerses}
          title={`${chapter.title} || ${chapter.subtitle}`}
          chapterNumber={chapter.number}
        />
      </ThemedView>
    </ImageBackground>
  );
};
