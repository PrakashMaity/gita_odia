import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { router } from 'expo-router';
import { useCallback, useRef } from 'react';

/**
 * Custom hook for chapters operations
 * Follows Single Responsibility Principle - handles navigation logic
 */
export const useChaptersOperations = () => {
  const { showAd, isLoaded } = useInterstitialAd();
  const chapterOpenCountRef = useRef(0);

  const handleChapterPress = useCallback((chapterId: string) => {
    router.push(`/chapter/${chapterId}`);

    chapterOpenCountRef.current += 1;
    if (isLoaded) {
      showAd();
    }
  }, [isLoaded, showAd]);

  return {
    handleChapterPress,
  };
};
