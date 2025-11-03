import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for translations operations
 * Follows Single Responsibility Principle - handles navigation logic
 */
export const useTranslationsOperations = () => {
  const handleTranslationPress = useCallback((chapterId: string) => {
    router.push(`/translation/${chapterId}`);
  }, []);

  return {
    handleTranslationPress,
  };
};

