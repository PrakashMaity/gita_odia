import { BannerAdComponent } from '@/components/ads';
import { LoadingState } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useTranslationStore } from '@/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, TouchableOpacity } from 'react-native';
import { AudioModal } from './components/AudioModal';
import { ErrorState } from './components/ErrorState';
import { TranslationMessage } from './components/TranslationMessage';

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
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {/* Custom Modern Header */}
      <Box
        className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
        style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(20, 20) }}
      >
        <HStack className="items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70 border border-amber-100/50"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>

          <Text
            className="text-[18px] font-black tracking-tight flex-1 text-center px-2"
            style={{ fontWeight: 'bold', color: theme.text.primary }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {`${chapter.title} || ${chapter.subtitle}`}
          </Text>

          <TouchableOpacity
            onPress={() => setIsFullChapterAudioModalVisible(true)}
            className="w-10 h-10 rounded-[14px] items-center justify-center active:opacity-70"
            style={{ backgroundColor: theme.background.quaternary }}
          >
            <MaterialIcons
              name="volume-down"
              size={SIZES.icon.md}
              color={theme.icon.tertiary}
            />
          </TouchableOpacity>
        </HStack>
      </Box>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {verses?.map((verse, index) => {
          const totalVerses = verses?.length || 0;
          const middleIndex = Math.floor(totalVerses / 2);
          const isCenterPosition = index === middleIndex;
          const isBelowCenterPosition = index === Math.floor(totalVerses * 0.75);

          return (
            <Box key={verse.id}>
              <TranslationMessage
                verse={verse}
                index={index}
                shouldShowBanner={(index + 1) % 4 === 0}
                chapterId={chapter.id}
                chapterNumber={chapter.number}
              />
              {isCenterPosition && (
                <Box className="w-full my-6 flex items-center">
                  <BannerAdComponent
                    adKey={`translation-detail-center-${chapter.id}`}
                  />
                </Box>
              )}
              {isBelowCenterPosition && (
                <Box className="w-full my-6 flex items-center">
                  <BannerAdComponent
                    adKey={`translation-detail-below-center-${chapter.id}`}
                  />
                </Box>
              )}
            </Box>
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
    </Box>
  );
};
