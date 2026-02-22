import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useRef } from 'react';
import { router } from 'expo-router';
import { useCallback } from 'react';

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
    if (chapterOpenCountRef.current % 2 === 0 && isLoaded) {
      showAd();
    }
  }, [isLoaded, showAd]);

  return {
    handleChapterPress,
  };
};
