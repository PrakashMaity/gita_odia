import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for chapters operations
 * Follows Single Responsibility Principle - handles navigation logic
 */
export const useChaptersOperations = () => {
  const handleChapterPress = useCallback((chapterId: string) => {
    router.push(`/chapter/${chapterId}`);
  }, []);

  return {
    handleChapterPress,
  };
};

