import { useProgressStore } from '@/store';
import { useCallback } from 'react';

interface ChapterData {
  verses?: Array<{ id: string }>;
}

/**
 * Custom hook for chapter detail operations
 * Follows Single Responsibility Principle - handles verse navigation and progress updates
 */
export const useChapterDetailOperations = (
  chapterData: ChapterData | null,
  chapterId: string | undefined,
  currentVerse: number,
  setCurrentVerse: (verse: number) => void
) => {
  const { updateProgress, markChapterCompleted } = useProgressStore();

  const handlePreviousVerse = useCallback(() => {
    if (currentVerse > 0 && chapterData && chapterData.verses && chapterId) {
      const newVerse = currentVerse - 1;
      setCurrentVerse(newVerse);
      const currentVerseData = chapterData.verses[newVerse];
      if (currentVerseData) {
        updateProgress(chapterId, currentVerseData.id, chapterData.verses.length);
      }
    }
  }, [currentVerse, chapterData, chapterId, setCurrentVerse, updateProgress]);

  const handleNextVerse = useCallback(() => {
    if (chapterData && chapterData.verses && currentVerse < chapterData.verses.length - 1 && chapterId) {
      const newVerse = currentVerse + 1;
      setCurrentVerse(newVerse);
      
      const currentVerseData = chapterData.verses[newVerse];
      if (currentVerseData) {
        updateProgress(chapterId, currentVerseData.id, chapterData.verses.length);
        
        if (newVerse === chapterData.verses.length - 1) {
          markChapterCompleted(chapterId);
        }
      }
    } else if (chapterData && chapterData.verses && currentVerse === 0 && chapterId) {
      const currentVerseData = chapterData.verses[0];
      if (currentVerseData) {
        updateProgress(chapterId, currentVerseData.id, chapterData.verses.length);
      }
    }
  }, [chapterData, chapterId, currentVerse, setCurrentVerse, updateProgress, markChapterCompleted]);

  return {
    handlePreviousVerse,
    handleNextVerse,
  };
};

