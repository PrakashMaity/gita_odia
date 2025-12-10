import { ReadingProgress } from '@/components/progress';
import { AudioModal } from '@/components/screens/translationDetail/components/AudioModal';
import { LoadingState, PageHeader } from '@/components/shared';
import { ThemedSpacer } from '@/components/ui/ThemedSpacer/ThemedSpacer';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { VerseReader } from '@/components/verseReader';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { useChapterStore } from '@/store';
import { LayoutImages } from '@/utils/assets';
import { MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './ChapterDetailScreen.styles';
import { ErrorState } from './components/ErrorState';
import { VerseNavigation } from './components/VerseNavigation';
import { useChapterDetailInitialization } from './hooks/useChapterDetailInitialization';
import { useChapterDetailOperations } from './hooks/useChapterDetailOperations';

export const ChapterDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading } = useChapterStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const { theme } = useTheme();
  const [showTranslation, setShowTranslation] = React.useState(true);
  const [showLanguage, setShowLanguage] = React.useState(true);
  const [isFullChapterAudioModalVisible, setIsFullChapterAudioModalVisible] = useState(false);
  const { showAd,isLoaded } = useInterstitialAd();
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

  // Show interstitial ad after every three verses
  useEffect(() => {
    if (!chapterData?.verses || currentVerse < 0) return;

    // Show ad after reading 3rd, 6th, 9th verse, etc. (indices 2, 5, 8, ...)
    // Formula: (currentVerse + 1) % 3 === 0 && currentVerse >= 2
    const shouldShowAd = (currentVerse + 1) % 3 === 0 && currentVerse >= 2;
    
    if (shouldShowAd && !adsShownRef.current.has(currentVerse)) {
      adsShownRef.current.add(currentVerse);
      // Show ad after a short delay
      const timer = setTimeout(() => {
        showAd();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentVerse, chapterData, showAd]);

  // Prepare full chapter verses for audio with speaker-specific voices
  // Separate Language and translation for proper playback sequence
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
    <ImageBackground
      source={LayoutImages.background2}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        {AlertComponent}
        <PageHeader
          title={`${chapter.title} || ${chapter.subtitle}`}
          onBack={() => {
            router.back();
            showAd();
          }}
          rightAction={
            <TouchableOpacity
              onPress={() => setIsFullChapterAudioModalVisible(true)}
              style={[
                styles.headerAudioButton,
                { backgroundColor: theme.background.quaternary },
              ]}
            >
              <MaterialIcons
                name="volume-up"
                size={SIZES.icon.md}
                color={theme.icon.primary}
              />
            </TouchableOpacity>
          }
        />

        <ScrollView style={styles.verseContainer} showsVerticalScrollIndicator={false}>
          <ThemedSpacer size="md" />
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
        </ScrollView>

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
      </ThemedView>
    </ImageBackground>
  );
};
