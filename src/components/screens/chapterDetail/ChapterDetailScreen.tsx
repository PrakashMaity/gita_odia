import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { ReadingProgress } from '@/components/progress';
import { BookmarkButton } from '../bookmarks/components';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { VerseReader } from '@/components/verseReader';
import { SIZES } from '@/rootconstants/sizes';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useChapterStore, useProgressStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { PageHeader } from '../shared/PageHeader';
import { LoadingState } from '../shared/LoadingState';

export const ChapterDetailScreen: React.FC = () => {
  const { theme } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getChapterById, isLoading } = useChapterStore();
  const { updateProgress, loadProgress, getProgress, markChapterCompleted } = useProgressStore();
  const { showAlert, AlertComponent } = useCustomAlert();
  const [currentVerse, setCurrentVerse] = useState(0);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showLanguage, setShowLanguage] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const { incrementAction, showInterstitialIfReady, showRewardedIfReady } = useAdFrequency({
    interstitialInterval: 3,
    rewardedCooldown: 3,
  });
  
  const chapterData = id ? getChapterById(id) : null;

  useEffect(() => {
    const initializeProgress = async () => {
      await loadProgress();
      if (chapterData && id) {
        const chapterProgress = getProgress(id);
        if (chapterProgress && chapterData.verses) {
          const lastReadVerseIndex = chapterData.verses.findIndex(
            verse => verse.id === chapterProgress.lastReadVerseId
          );
          if (lastReadVerseIndex !== -1) {
            setCurrentVerse(lastReadVerseIndex);
          }
        }
      }
      setIsInitialized(true);
    };
    
    initializeProgress();
  }, [loadProgress, getProgress, chapterData, id]);

  const handlePreviousVerse = () => {
    if (currentVerse > 0 && chapterData && chapterData.verses && id) {
      const newVerse = currentVerse - 1;
      setCurrentVerse(newVerse);
      const currentVerseData = chapterData.verses[newVerse];
      if (currentVerseData) {
        updateProgress(id, currentVerseData.id, chapterData.verses.length);
      }
    }
  };

  const handleNextVerse = () => {
    if (chapterData && chapterData.verses && currentVerse < chapterData.verses.length - 1 && id) {
      const newVerse = currentVerse + 1;
      setCurrentVerse(newVerse);
      incrementAction();
      
      const currentVerseData = chapterData.verses[newVerse];
      if (currentVerseData) {
        updateProgress(id, currentVerseData.id, chapterData.verses.length);
        
        if (newVerse === chapterData.verses.length - 1) {
          markChapterCompleted(id);
        }
      }
      
      setTimeout(() => {
        showInterstitialIfReady();
      }, 1000);
    } else if (chapterData && chapterData.verses && currentVerse === 0 && id) {
      const currentVerseData = chapterData.verses[0];
      if (currentVerseData) {
        updateProgress(id, currentVerseData.id, chapterData.verses.length);
      }
    }
  };

  const toggleTranslation = () => setShowTranslation(!showTranslation);
  const toggleLanguage = () => setShowLanguage(!showLanguage);

  if (isLoading || !isInitialized) {
    return <LoadingState message={i18n.t('chapter.loading')} />;
  }

  if (!chapterData) {
    return (
      <ThemedView variant="primary" style={styles.errorContainer}>
        <ThemedLanguageText 
          variant="error" 
          size="medium"
          fontFamily="regional_secondary"
        >
          {i18n.t('chapter.notFound')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  const { chapter, verses } = chapterData;
  const currentVerseData = verses?.[currentVerse];

  return (
    <ThemedView variant="primary" style={styles.container}>
      {AlertComponent}
      <PageHeader
        title={`${chapter.title} || ${chapter.subtitle}`}
        onBack={() => {
          router.back();
          showRewardedIfReady();
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

      <ThemedView style={styles.bottomNavigation}>
        <TouchableOpacity
          onPress={handlePreviousVerse}
          disabled={currentVerse <= 0}
          style={[
            styles.verseNavButton,
            {
              backgroundColor: theme.background.secondary,
              opacity: currentVerse <= 0 ? 0.5 : 1
            }
          ]}
        >
          <Ionicons name="chevron-back" size={SIZES.icon.md} color={theme.icon.primary} />
          <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="medium">
            {i18n.t('common.previous')}
          </ThemedLanguageText>
        </TouchableOpacity>
        <BookmarkButton
          verseId={currentVerseData.id}
          chapterId={chapter.id}
          chapterNumber={chapter.number}
          verseNumber={currentVerseData.verseNumber}
          verseText={currentVerseData.Language}
        />
        <TouchableOpacity
          onPress={handleNextVerse}
          disabled={currentVerse >= (verses?.length || 0) - 1}
          style={[
            styles.verseNavButton,
            {
              backgroundColor: theme.background.secondary,
              opacity: currentVerse >= (verses?.length || 0) - 1 ? 0.5 : 1
            }
          ]}
        >
          <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="medium">
            {i18n.t('common.next')}
          </ThemedLanguageText>
          <Ionicons name="chevron-forward" size={SIZES.icon.md} color={theme.icon.primary} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.xl,
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.lg,
    gap: SIZES.spacing.xs,
  },
  verseNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.spacing.sm,
    minHeight: 44,
  },
});

