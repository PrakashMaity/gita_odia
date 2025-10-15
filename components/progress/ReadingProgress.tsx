import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useProgressStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface ReadingProgressProps {
  chapterId: string;
  currentVerseIndex: number;
  totalVerses: number;
  onProgressUpdate?: (progress: any) => void;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export default function ReadingProgress({
  chapterId,
  currentVerseIndex,
  totalVerses,
  onProgressUpdate,
  onAlert,
}: ReadingProgressProps) {
  const { theme } = useTheme();
  const { 
    progress, 
    isLoading, 
    loadProgress, 
    resetChapterProgress, 
    getProgressPercentage 
  } = useProgressStore();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const chapterProgress = progress[chapterId];

  const resetProgress = async () => {
    try {
      await resetChapterProgress(chapterId);
      onProgressUpdate?.(null);
      onAlert?.(i18n.t('progress.reset'), i18n.t('progress.resetSuccess'), 'success');
    } catch (error) {
      console.error('Error resetting progress:', error);
      onAlert?.(i18n.t('common.error'), i18n.t('progress.resetError'), 'error');
    }
  };

  const getProgressPercentageValue = () => {
    return getProgressPercentage(chapterId, currentVerseIndex, totalVerses);
  };

  // Get current language and locale mapping
  const currentLang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  const localeMap: Record<string, string> = {
    bn: 'bn-BD',
    or: 'or-IN',
    hi: 'hi-IN',
    as: 'as-IN',
  };

  const formatLastReadDate = () => {
    if (!chapterProgress) return '';
    const date = new Date(chapterProgress.lastReadDate);
    const locale = localeMap[currentLang] || 'bn-BD';
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedLanguageText variant="secondary" size="small">
          {i18n.t('common.loading')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  if (!chapterProgress) {
    return (
      <ThemedView style={styles.container}>
        <ThemedLanguageText fontFamily='regional_secondary' variant="tertiary" size="small">
          {i18n.t('progress.notStarted')}
        </ThemedLanguageText>
      </ThemedView>
    );
  }

  return (
    <ThemedCard variant="primary" style={styles.container}>
      <ThemedView style={styles.progressHeader}>
        <ThemedLanguageText fontFamily='regional_secondary' variant="primary" size="xl" style={styles.progressTitle}>
          {i18n.t('progress.readingProgress')}
        </ThemedLanguageText>
        <TouchableOpacity onPress={resetProgress} style={styles.resetButton}>
          <Ionicons name="refresh-outline" size={SIZES.icon.md} color={theme.icon.primary} />
        </TouchableOpacity>
      </ThemedView>

      <ThemedLanguageText variant="secondary" fontFamily='regional_secondary' size="medium" style={styles.progressSubtitle}>
        {i18n.t('progress.lastRead', { date: formatLastReadDate() })}
      </ThemedLanguageText>

      <ThemedView style={styles.progressBarContainer}>
        <ThemedView style={[styles.progressBar, { backgroundColor: theme.background.tertiary }]}>
          <ThemedView style={[
            styles.progressFill,
            { 
              backgroundColor: theme.button.primary.background,
              width: `${getProgressPercentageValue()}%` 
            }
          ]} />
        </ThemedView>
        
      
      </ThemedView>

      {chapterProgress.isCompleted && (
        <ThemedView style={styles.completionBadge}>
          <Ionicons name="checkmark-circle" size={SIZES.icon.sm} color={theme.icon.success} />
          <ThemedLanguageText fontFamily='regional_secondary' variant="success" size="small" style={styles.completionText}>
{i18n.t('progress.chapterComplete')}
          </ThemedLanguageText>
        </ThemedView>
      )}
    </ThemedCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.lg,
  },
  loadingText: {
    fontSize: SIZES.sm,
    textAlign: 'center',
  },
  noProgressText: {
    fontSize: SIZES.sm,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  progressTitle: {
  
  },
  progressSubtitle: {
    fontSize: SIZES.md,
    marginBottom: SIZES.spacing.md,
  },
  resetButton: {
    padding: SIZES.spacing.xs,
  },
  progressBarContainer: {
    marginBottom: SIZES.spacing.sm,
  },
  progressBar: {
    height: SIZES.spacing.xs,
    borderRadius: SIZES.radius.xs,
    overflow: 'hidden',
    marginBottom: SIZES.spacing.sm,
  },
  progressFill: {
    height: '100%',
    borderRadius: SIZES.radius.xs,
  },
  progressText: {
    fontSize: SIZES.sm,
    textAlign: 'right',
  },
  completionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.sm,
  },
  completionText: {
    fontSize: SIZES.sm,
    fontWeight: 'bold',
    marginLeft: SIZES.spacing.sm,
  },
});
