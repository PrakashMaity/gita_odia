import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useRef } from 'react';
import { router } from 'expo-router';
import { useCallback } from 'react';

/**
 * Custom hook for translations operations
 * Follows Single Responsibility Principle - handles navigation logic
 */
export const useTranslationsOperations = () => {
  const { showAd, isLoaded } = useInterstitialAd();
  const translationOpenCountRef = useRef(0);

  const handleTranslationPress = useCallback((chapterId: string) => {
    router.push(`/translation/${chapterId}`);
    translationOpenCountRef.current += 1;
    if (translationOpenCountRef.current % 2 === 0 && isLoaded) {
      showAd();
    }
  }, [isLoaded, showAd]);

  return {
    handleTranslationPress,
  };
};
