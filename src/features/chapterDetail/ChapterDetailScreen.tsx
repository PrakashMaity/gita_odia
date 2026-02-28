import { ReadingProgress } from '@/components/progress';
import { LoadingState } from '@/components/shared';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { VStack } from '@/components/ui/vstack';
import { VerseReader } from '@/components/verseReader';
import { AudioModal } from '@/features/translationDetail/components/AudioModal';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { useChapterStore } from '@/store';
import { FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ErrorState } from './components/ErrorState';
import { VerseNavigation } from './components/VerseNavigation';
import { useChapterDetailInitialization } from './hooks/useChapterDetailInitialization';
import { useChapterDetailOperations } from './hooks/useChapterDetailOperations';

export const ChapterDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading } = useChapterStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();

  const [showTranslation, setShowTranslation] = useState(true);
  const [showLanguage, setShowLanguage] = useState(true);
  const [isFullChapterAudioModalVisible, setIsFullChapterAudioModalVisible] = useState(false);
  const { showAd, isLoaded } = useInterstitialAd();
  const adsShownRef = useRef<Set<number>>(new Set());

  const {
    chapterData,
    currentVerse,
    setCurrentVerse,
    isInitialized
  } = useChapterDetailInitialization(id);

  const {
    handlePreviousVerse: baseHandlePreviousVerse,
    handleNextVerse: baseHandleNextVerse
  } = useChapterDetailOperations(chapterData, id, currentVerse, setCurrentVerse);

  const handleNextVerse = useCallback(() => {
    baseHandleNextVerse();
  }, [baseHandleNextVerse]);

  const handlePreviousVerse = useCallback(() => {
    baseHandlePreviousVerse();
  }, [baseHandlePreviousVerse]);

  const toggleTranslation = useCallback(() => setShowTranslation(prev => !prev), []);
  const toggleLanguage = useCallback(() => setShowLanguage(prev => !prev), []);

  // Show interstitial ad after every two verses for non-Pro users.
  useEffect(() => {
    if (!chapterData?.verses || currentVerse < 0) return;

    // Show ad after every verse read (starting from 2nd verse, index 1)
    const shouldShowAd = currentVerse >= 1;

    if (shouldShowAd && !adsShownRef.current.has(currentVerse)) {
      adsShownRef.current.add(currentVerse);
      const timer = setTimeout(() => {
        showAd();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentVerse, chapterData, showAd]);

  const fullChapterVerses = useMemo(() => {
    if (!chapterData?.verses || chapterData.verses.length === 0) return [];
    return chapterData.verses.map((verse: any) => ({
      Language: verse.Language,
      translation: verse.translation,
      speakerEnglish: verse.speaker_english,
    }));
  }, [chapterData?.verses]);

  if (isLoading || !isInitialized) {
    return <LoadingState message={i18n.t('chapter.loading')} />;
  }

  if (!chapterData) {
    return <ErrorState />;
  }

  const { chapter, verses } = chapterData;
  const currentVerseData = verses?.[currentVerse];

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {AlertComponent}

      {/* Header */}
      <Box
        className="pb-4 px-4 shadow-sm z-10"
        style={{
          backgroundColor: theme.background.secondary,
          paddingTop: Math.max(insets.top, 20),
          borderBottomWidth: 1,
          borderBottomColor: theme.border.primary + '20',
        }}
      >
        <HStack className="items-center justify-between mt-2">
          <Pressable
            className="w-10 h-10 rounded-[14px] items-center justify-center active:opacity-70"
            style={{
              backgroundColor: theme.background.primary,
              borderWidth: 1,
              borderColor: theme.border.primary + '30',
            }}
            onPress={() => {
              router.back();
              showAd();
            }}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </Pressable>

          <VStack className="items-center flex-1 px-4">
            <AppHeading
              variant="section"
              numberOfLines={1}
              style={{ color: theme.text.primary }}
            >
              {chapter.title}
            </AppHeading>
            {chapter.subtitle && chapter.subtitle !== chapter.title && (
              <AppText
                variant="caption"
                className="text-center mt-1"
                numberOfLines={1}
                style={{ color: theme.text.secondary }}
              >
                {chapter.subtitle}
              </AppText>
            )}
          </VStack>

          <Pressable
            className="w-10 h-10 rounded-[14px] items-center justify-center active:opacity-70 shadow-sm"
            style={{
              backgroundColor: theme.background.quaternary,
              borderWidth: 1,
              borderColor: theme.border.primary + '30',
            }}
            onPress={() => setIsFullChapterAudioModalVisible(true)}
          >
            <MaterialIcons name="volume-up" size={24} color={theme.icon.primary} />
          </Pressable>
        </HStack>
      </Box>

      {/* Main Content Area */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 }}
      >
        <Box
          className="rounded-[28px] p-2 shadow-sm overflow-hidden mb-6 relative"
          style={{
            backgroundColor: theme.background.primary,
            borderWidth: 1,
            borderColor: theme.border.primary + '30',
          }}
        >
          {/* subtle watermark for verse card */}
          <Box className="absolute -left-6 -bottom-6 opacity-[0.03]" pointerEvents="none">
            <FontAwesome5 name="book-open" size={160} color={theme.text.disabled} />
          </Box>

          <VerseReader
            verse={currentVerseData}
            showLanguage={showLanguage}
            showTranslation={showTranslation}
            onToggleLanguage={toggleLanguage}
            onToggleTranslation={toggleTranslation}
            chapterId={chapter.id}
            chapterNumber={chapter.number}
            onAlert={(title, message, type) => {
              if (type === 'success') {
                showAlert(createSuccessAlert(title, message));
              } else if (type === 'error') {
                showAlert(createErrorAlert(title, message));
              } else {
                showAlert({ title, message });
              }
            }}
          />
        </Box>

        <Box className="mb-2">
          <ReadingProgress
            chapterId={chapter.id}
            currentVerseIndex={currentVerse}
            totalVerses={verses?.length || 0}
            onAlert={(title, message, type) => {
              if (type === 'success') {
                showAlert(createSuccessAlert(title, message));
              } else if (type === 'error') {
                showAlert(createErrorAlert(title, message));
              } else {
                showAlert({ title, message });
              }
            }}
          />
        </Box>
      </ScrollView>

      {/* Modern Bottom Navigation */}
      <VerseNavigation
        currentVerse={currentVerse}
        totalVerses={verses?.length || 0}
        currentVerseData={currentVerseData}
        chapterId={chapter.id}
        chapterNumber={chapter.number}
        onPrevious={handlePreviousVerse}
        onNext={handleNextVerse}
      />

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
