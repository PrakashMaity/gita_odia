import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { BookmarkIcon } from '@/components/ui/BookmarkIcon';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedLinearProgress } from '@/components/ui/ThemedLinearProgress';
import ThemedSafeAreaView from '@/components/ui/ThemedSafeAreaView/ThemedSafeAreaView';
import { ThemedSpacer } from '@/components/ui/ThemedSpacer/ThemedSpacer';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import { WavePattern } from '@/illustration/cardBackground';
import { ChapterData, useChapterStore, useProgressStore } from '@/store';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';



export default function ChaptersScreen() {
  const { theme } = useTheme();
  const { width, height } = Dimensions.get('window');
  const { chapters, isLoading } = useChapterStore();
  const {
    progress,
    isLoading: progressLoading,
    loadProgress,
    getProgressPercentage
  } = useProgressStore();
  const { incrementAction, showInterstitialIfReady } = useAdFrequency({
    interstitialInterval: 2, // Show interstitial every 2-3 chapter views
  });

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const handleChapterPress = (chapterId: string) => {
    incrementAction();
    router.push(`/chapter/${chapterId}`);
    
    // Show interstitial after navigation
    setTimeout(() => {
      showInterstitialIfReady();
    }, 500);
  };

  const renderChapterCard = (chapter: ChapterData) => {
    const { chapter: chapterInfo } = chapter;
    const chapterId = chapterInfo.id;
    const chapterProgress = progress[chapterId];

    // Calculate progress percentage based on last read verse
    let progressPercentage = 0;
    if (chapterProgress && chapter.verses) {
      const lastReadVerseIndex = chapter.verses.findIndex(
        verse => verse.id === chapterProgress.lastReadVerseId
      );
      if (lastReadVerseIndex !== -1) {
        progressPercentage = getProgressPercentage(chapterId, lastReadVerseIndex, chapter.verses.length);
      }
    }

    return (
      <TouchableOpacity
        key={chapterInfo.id}
        onPress={() => handleChapterPress(chapterInfo.id)}
        style={styles.chapterCardContainer}

      >
        <ThemedCard style={[styles.chapterCard]} pattern='blob' patternOpacity={0.05}>
          <ThemedView style={{ flexDirection: 'row' }} >
            <ThemedView style={[styles.iconContainer, {
              backgroundColor: theme.background.tertiary,

            }]}>
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
                style={styles.chapterNumber}
              >
                {chapterInfo.number}
              </ThemedLanguageText>
            </ThemedView>

            {/* Text Content */}
            <ThemedView style={styles.textContainer}>

              {chapterInfo.subtitle && chapterInfo.subtitle !== chapterInfo.title && (
                <ThemedLanguageText
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.chapterSubtitle}
                  numberOfLines={1}
                >
                  {chapterInfo.subtitle}
                </ThemedLanguageText>
              )}

              <ThemedView style={styles.chapterInfo}>
                <ThemedLanguageText
                  variant="secondary"
                  size="small"
                  fontFamily="regional_secondary"
                  style={styles.verseCount}
                >
                  {chapterInfo.totalVerses} ଶ୍ଲୋକ
                </ThemedLanguageText>

              </ThemedView>
            </ThemedView>

            {/* Arrow Container */}
            <ThemedView style={[styles.arrowContainer, { backgroundColor: theme.background.quaternary }]}>
              <MaterialIcons
                name="arrow-forward-ios"
                size={SIZES.icon.xs}
                color={theme.icon.quaternary}
              />
            </ThemedView>
          </ThemedView>

          {chapterProgress && progressPercentage > 0 && (
            <>
              <ThemedSpacer size='md' />
              <ThemedView>
                <ThemedLinearProgress
                  progress={progressPercentage / 100}
                  height={20}
                  variant="primary"
                  showPercentage={false}
                >
                  <ThemedLanguageText
                    variant="tertiary"
                    size="xs"
                    style={styles.progressText}
                  >
                    {progressPercentage}%
                  </ThemedLanguageText>
                </ThemedLinearProgress>

              </ThemedView>
            </>

          )}

        </ThemedCard>

      </TouchableOpacity>
    );
  };

  if (isLoading || progressLoading) {
    return (
      <ThemedSafeAreaView>
        <View style={styles.loadingContainer}>
          <WavePattern width={200} height={200} opacity={0.1} />
          <ThemedLanguageText
            variant="secondary"
            size="large"
            fontFamily="regional_primary"
            style={styles.loadingText}
          >
            ଅଧ୍ୟାୟଗୁଡ଼ିକ ଲୋଡ଼ ହେଉଛି...
          </ThemedLanguageText>
        </View>
      </ThemedSafeAreaView>
    );
  }

  return (
    <ThemedView variant="primary" style={styles.container}>
      <WavePattern
        width={width}
        height={height}
      />

      {/* Header Card */}
      <ThemedCard variant='transparent' style={styles.headerCard}>
        <ThemedLanguageText
          variant="primary"
          size="title"
          fontFamily="regional_secondary"
          style={styles.title}
        >
          ଅଧ୍ୟାୟସମୂହ
        </ThemedLanguageText>
        <ThemedView style={styles.headerActions}>

          <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
            <BookmarkIcon
              size={SIZES.icon.xl}
              color={theme.icon.primary}
              focused={true}
              showBadge={true}
              badgeSize="medium"
            />
          </ThemedView>
        </ThemedView>
      </ThemedCard>


      {/* Chapters List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.section}>
          <ThemedView style={styles.sectionHeader}>
            <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.background.quaternary }]} />
            <ThemedLanguageText
              variant="primary"
              size="xl"
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              ଭଗବଦ୍ଗୀତା ଅଧ୍ୟାୟସମୂହ
            </ThemedLanguageText>
          </ThemedView>
          <ThemedView style={styles.chaptersContainer}>
            {chapters.map(renderChapterCard)}
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SIZES.spacing.lg,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
  },
  actionButton: {
    borderWidth: SIZES.borderSize.sm,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  chaptersContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    // gap: SIZES.spacing.sm,
  },
  chapterCardContainer: {
    // marginBottom: SIZES.spacing.sm,
  },
  chapterCard: {

    alignItems: 'center',
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
    // marginBottom: SIZES.spacing.md,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.lg,
    elevation: 4,
  },
  chapterNumber: {
    // Font styling handled by ThemedLanguageText component
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  chapterTitle: {
    marginBottom: SIZES.spacing.xs,
    lineHeight: 26,
  },
  chapterSubtitle: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 20,
    opacity: 0.85,
  },
  chapterEnglishTitle: {
    fontSize: SIZES.sm,
    fontStyle: 'italic',
    marginBottom: SIZES.spacing.sm,
    lineHeight: SIZES.spacing.lg,
  },
  iconContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.2,
    shadowRadius: SIZES.shadow.md,
    elevation: 3,
  },
  verseCount: {
    opacity: 0.9,
  },
  chapterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  progressText: {
    opacity: 0.9,
    fontWeight: '600',
    textAlign: 'center',
  },
  noProgressContainer: {
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noProgressText: {
    opacity: 0.6,
    fontWeight: '600',
    textAlign: 'center',
  },
  arrowContainer: {
    width: SIZES.avatar.sm,
    height: SIZES.avatar.sm,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.sm,
  },
});