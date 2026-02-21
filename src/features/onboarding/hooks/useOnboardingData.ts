import i18n from '@/lib/i18n';
import { OnboardingSlide } from '@/types/screen.interface';
import { OnboardingImages } from '@/lib/utils/assets';
import { useMemo } from 'react';

/**
 * Custom hook for onboarding data
 * Follows Single Responsibility Principle - handles onboarding slides data
 */
export const useOnboardingData = () => {
  const slides = useMemo((): OnboardingSlide[] => [
    {
      id: 1,
      image: OnboardingImages.banner1,
      title: i18n.t('onboarding.slides.slide1.title'),
      subtitle: i18n.t('onboarding.slides.slide1.subtitle'),
      description: i18n.t('onboarding.slides.slide1.description')
    },
    {
      id: 2,
      image: OnboardingImages.banner2,
      title: i18n.t('onboarding.slides.slide2.title'),
      subtitle: i18n.t('onboarding.slides.slide2.subtitle'),
      description: i18n.t('onboarding.slides.slide2.description')
    },
    {
      id: 3,
      image: OnboardingImages.banner3,
      title: i18n.t('onboarding.slides.slide3.title'),
      subtitle: i18n.t('onboarding.slides.slide3.subtitle'),
      description: i18n.t('onboarding.slides.slide3.description')
    }
  ], []);

  return { slides };
};

