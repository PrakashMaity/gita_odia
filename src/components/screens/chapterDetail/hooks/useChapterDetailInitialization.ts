import { useChapterStore, useProgressStore } from '@/store';
import { useEffect, useState } from 'react';

/**
 * Custom hook for initializing chapter detail screen
 * Follows Single Responsibility Principle - handles data initialization
 */
export const useChapterDetailInitialization = (chapterId: string | undefined) => {
  const { getChapterById } = useChapterStore();
  const { loadProgress, getProgress } = useProgressStore();
  const [currentVerse, setCurrentVerse] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const chapterData = chapterId ? getChapterById(chapterId) : null;

  useEffect(() => {
    const initializeProgress = async () => {
      await loadProgress();
      if (chapterData && chapterId) {
        const chapterProgress = getProgress(chapterId);
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
  }, [loadProgress, getProgress, chapterData, chapterId]);

  return {
    chapterData,
    currentVerse,
    setCurrentVerse,
    isInitialized,
  };
};

