import { useAdFrequency } from '@/components/ads/hooks/useAdFrequency';
import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for search navigation
 * Follows Single Responsibility Principle - handles result navigation with ad logic
 */
export const useSearchNavigation = () => {
  const { incrementAction, showInterstitialIfReady } = useAdFrequency({
    interstitialInterval: 2,
  });

  const handleResultPress = useCallback((chapterNumber: number, verseNumber: number) => {
    incrementAction();
    router.push(`/chapter/${chapterNumber}?verse=${verseNumber}`);
    
    setTimeout(() => {
      showInterstitialIfReady();
    }, 500);
  }, [incrementAction, showInterstitialIfReady]);

  return {
    handleResultPress,
  };
};

