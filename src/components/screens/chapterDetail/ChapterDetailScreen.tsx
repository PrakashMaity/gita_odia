import { ReadingProgress } from '@/components/progress';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { VerseReader } from '@/components/verseReader';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import i18n from '@/i18n';
import { useChapterStore } from '@/store';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useCallback } from 'react';
import { ImageBackground, ScrollView } from 'react-native';
import { PageHeader, LoadingState } from '@/components/shared';
import { ErrorState } from './components/ErrorState';
import { VerseNavigation } from './components/VerseNavigation';
import { useChapterDetailInitialization } from './hooks/useChapterDetailInitialization';
import { useChapterDetailOperations } from './hooks/useChapterDetailOperations';
import { styles } from './ChapterDetailScreen.styles';
import { LayoutImages } from '@/utils/assets';

export const ChapterDetailScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { isLoading } = useChapterStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [showTranslation, setShowTranslation] = React.useState(true);
  const [showLanguage, setShowLanguage] = React.useState(true);

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
          }}
        />

        <ScrollView style={styles.verseContainer} showsVerticalScrollIndicator={false}>
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
      </ThemedView>
    </ImageBackground>
  );
};
