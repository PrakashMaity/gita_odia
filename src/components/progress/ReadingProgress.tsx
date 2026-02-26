import { AppText } from '@/components/ui/AppText';
import { Box } from '@/components/ui/box';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { formatLastReadDate } from '@/lib/utils/dateUtils';
import { useProgressStore } from '@/store';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';

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
  const theme = useThemeColors();
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

  if (isLoading) {
    return (
      <View className="mb-6">
        <AppText
          variant="secondary"
          className="text-center"
          style={{ color: theme.text.disabled }}
        >
          {i18n.t('common.loading')}
        </AppText>
      </View>
    );
  }

  if (!chapterProgress) {
    return (
      <View className="mb-6">
        <AppText
          variant="secondary"
          className="text-center"
          style={{ color: theme.text.secondary }}
        >
          {i18n.t('progress.notStarted')}
        </AppText>
      </View>
    );
  }

  return (
    <Box
      className="mb-6 p-6 rounded-2xl"
      style={{
        backgroundColor: theme.background.primary,
        borderWidth: 1,
        borderColor: theme.border.primary + '30',
      }}
    >
      <View className="flex-row justify-between items-center mb-2">
        <AppText
          variant="card-title"
          style={{ color: theme.text.primary }}
        >
          {i18n.t('progress.readingProgress')}
        </AppText>
        <TouchableOpacity onPress={resetProgress} className="p-1">
          <Ionicons name="refresh-outline" size={24} color={theme.icon.primary} />
        </TouchableOpacity>
      </View>

      <AppText
        variant="secondary"
        className="mb-4"
        style={{ color: theme.text.secondary }}
      >
        {i18n.t('progress.lastRead', { date: chapterProgress ? formatLastReadDate(chapterProgress.lastReadDate) : '' })}
      </AppText>

      <View className="mb-2">
        <View
          className="h-1.5 rounded-full overflow-hidden mb-2"
          style={{ backgroundColor: theme.border.primary + '20' }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${getProgressPercentageValue()}%`,
              backgroundColor: theme.icon.primary,
            }}
          />
        </View>
      </View>

      {chapterProgress.isCompleted && (
        <View className="flex-row items-center justify-center mt-2">
          <Ionicons name="checkmark-circle" size={16} color={theme.status.success} />
          <AppText
            variant="secondary"
            bold
            className="ml-2"
            style={{ color: theme.status.success }}
          >
            {i18n.t('progress.chapterComplete')}
          </AppText>
        </View>
      )}
    </Box>
  );
}
