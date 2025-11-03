import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { useSettingsStore } from '@/store';

/**
 * Custom hook for onboarding navigation
 * Follows Single Responsibility Principle - handles slide navigation and completion
 */
export const useOnboardingNavigation = (totalSlides: number) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { updateSetting } = useSettingsStore();

  const handleNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  }, [currentSlide, totalSlides]);

  const handleSkip = useCallback(() => {
    handleComplete();
  }, []);

  const handleComplete = useCallback(async () => {
    try {
      updateSetting('onboardingCompleted', true);
      await new Promise(resolve => setTimeout(resolve, 500));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/(tabs)');
    }
  }, [updateSetting]);

  const handlePrevious = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  }, [currentSlide]);

  return {
    currentSlide,
    isFirstSlide: currentSlide === 0,
    isLastSlide: currentSlide === totalSlides - 1,
    handleNext,
    handleSkip,
    handlePrevious,
  };
};

