import { useProgressStore } from '@/store';
import { ChapterData } from '@/store';
import { useEffect } from 'react';

/**
 * Custom hook for chapter progress management
 * Follows Single Responsibility Principle - handles progress loading and calculations
 */
export const useChapterProgress = () => {
  const {
    progress,
    isLoading: progressLoading,
    loadProgress,
    getProgressPercentage
  } = useProgressStore();

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const getChapterProgressPercentage = (chapter: ChapterData): number => {
    const { chapter: chapterInfo } = chapter;
    const chapterId = chapterInfo.id;
    const chapterProgress = progress[chapterId];

    let progressPercentage = 0;
    if (chapterProgress && chapter.verses) {
      const lastReadVerseIndex = chapter.verses.findIndex(
        (verse: any) => verse.id === chapterProgress.lastReadVerseId
      );
      if (lastReadVerseIndex !== -1) {
        progressPercentage = getProgressPercentage(chapterId, lastReadVerseIndex, chapter.verses.length);
      }
    }

    return progressPercentage;
  };

  return {
    progressLoading,
    getChapterProgressPercentage,
  };
};

