import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
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
        <Text className="text-sm text-center text-primary-600 font-regional_secondary">
          {i18n.t('common.loading')}
        </Text>
      </View>
    );
  }

  if (!chapterProgress) {
    return (
      <View className="mb-6">
        <Text className="text-sm text-center text-primary-600 font-regional_secondary">
          {i18n.t('progress.notStarted')}
        </Text>
      </View>
    );
  }

  return (
    <Box className="mb-6 p-6 rounded-2xl bg-white border border-primary-200 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-xl font-bold text-primary-950 font-regional_secondary">
          {i18n.t('progress.readingProgress')}
        </Text>
        <TouchableOpacity onPress={resetProgress} className="p-1">
          <Ionicons name="refresh-outline" size={24} color="#0f172a" />
        </TouchableOpacity>
      </View>

      <Text className="text-base text-primary-600 mb-4 font-regional_secondary">
        {i18n.t('progress.lastRead', { date: chapterProgress ? formatLastReadDate(chapterProgress.lastReadDate) : '' })}
      </Text>

      <View className="mb-2">
        <View className="h-1.5 rounded-full overflow-hidden mb-2 bg-primary-100">
          <View
            className="h-full rounded-full bg-primary-500"
            style={{ width: `${getProgressPercentageValue()}%` }}
          />
        </View>
      </View>

      {chapterProgress.isCompleted && (
        <View className="flex-row items-center justify-center mt-2">
          <Ionicons name="checkmark-circle" size={16} color="#10b981" />
          <Text className="text-sm font-bold ml-2 text-primary-950 font-regional_secondary">
            {i18n.t('progress.chapterComplete')}
          </Text>
        </View>
      )}
    </Box>
  );
}
