import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for search navigation
 * Follows Single Responsibility Principle - handles result navigation
 */
export const useSearchNavigation = () => {
  const handleResultPress = useCallback((chapterNumber: number, verseNumber: number) => {
    router.push(`/chapter/${chapterNumber}?verse=${verseNumber}`);
  }, []);

  return {
    handleResultPress,
  };
};

