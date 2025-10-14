import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { BookmarkButton } from '@/components/bookmark';
import { ReadingProgress } from '@/components/progress';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { VerseReader } from '@/components/verseReader';
import { SIZES } from '@/constants/sizes';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useChapterStore, useProgressStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';






export default function ChapterDetailScreen() {
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
    interstitialInterval: 2, // Show interstitial every 2-3 slokas
    rewardedCooldown: 3, // 3 minutes cooldown for rewarded ads
  });
  
  const chapterData = id ? getChapterById(id) : null;

  useEffect(() => {
    const initializeProgress = async () => {
      await loadProgress();
      if (chapterData && id) {
        const chapterProgress = getProgress(id);
        if (chapterProgress && chapterData.verses) {
          // Find the index of the last read verse
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
      // Update progress when going back
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
      incrementAction(); // Track verse navigation for ads
      
      // Update progress when going forward
      const currentVerseData = chapterData.verses[newVerse];
      if (currentVerseData) {
        updateProgress(id, currentVerseData.id, chapterData.verses.length);
        
        // Mark chapter as completed if this is the last verse
        if (newVerse === chapterData.verses.length - 1) {
          markChapterCompleted(id);
        }
      }
      
      // Show interstitial after verse transitions
      setTimeout(() => {
        showInterstitialIfReady();
      }, 1000);
    } else if (chapterData && chapterData.verses && currentVerse === 0 && id) {
      // First time reading - start progress tracking
      const currentVerseData = chapterData.verses[0];
      if (currentVerseData) {
        updateProgress(id, currentVerseData.id, chapterData.verses.length);
      }
    }
  };


  // Handle first-time reading - only when user actually navigates
  useEffect(() => {
    if (isInitialized && chapterData) {
      // Only start reading progress when user actually navigates to next verse
      // Don't automatically start progress just by viewing the chapter
    }
  }, [isInitialized, chapterData]);


  const toggleTranslation = () => setShowTranslation(!showTranslation);
  const toggleLanguage = () => setShowLanguage(!showLanguage);

  if (isLoading || !isInitialized) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ThemedLanguageText variant="secondary" size="medium">
          {i18n.t('chapter.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  if (!chapterData) {
    return (
      <ThemedView variant="primary" style={styles.errorContainer}>
        <ThemedLanguageText variant="error" size="medium">
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
      {/* Header */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={SIZES.icon.xl} color={theme.icon.primary} />
        </TouchableOpacity>

        <ThemedView style={styles.headerContent}>
          <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="xl" style={styles.chapterTitle}>
            {chapter.title} || {chapter.subtitle}
          </ThemedLanguageText>
       
        </ThemedView>
      </ThemedView>



      {/* Verse Display */}
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

        {/* Reading Progress */}
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


      {/* Bottom Navigation */}
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
            ପୂର୍ବବର୍ତ୍ତୀ
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
            ପରବର୍ତ୍ତୀ
          </ThemedLanguageText>
          <Ionicons name="chevron-forward" size={SIZES.icon.md} color={theme.icon.primary} />
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: SIZES.lg,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: SIZES.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.sm,
  },
  backButton: {
    marginRight: SIZES.spacing.lg,
    marginTop: SIZES.spacing.xs,
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    padding: SIZES.spacing.md,
  },
  chapterTitle: {
    // marginBottom: SIZES.spacing.xs,
    // lineHeight: 32,
  },
  chapterSubtitle: {
    marginBottom: SIZES.spacing.sm,
    // lineHeight: 24,
    opacity: 0.85,
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
