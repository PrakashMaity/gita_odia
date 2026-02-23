import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { OnboardingNavigation } from './components/OnboardingNavigation';
import { OnboardingSlide } from './components/OnboardingSlide';
import { useOnboardingData } from './hooks/useOnboardingData';
import { useOnboardingNavigation } from './hooks/useOnboardingNavigation';

export const OnboardingScreen: React.FC = () => {
  const { slides } = useOnboardingData();
  const {
    currentSlide,
    isFirstSlide,
    isLastSlide,
    handleNext,
    handleSkip,
    handlePrevious,
  } = useOnboardingNavigation(slides.length);

  const currentSlideData = slides[currentSlide];

  return (
    <Box className="flex-1 bg-black">
      <HStack className="justify-end items-center px-6 py-4">
        <TouchableOpacity onPress={handleSkip} className="px-4 py-2">
          <Text className="text-neutral-400 text-base font-regional_secondary">
            {i18n.t('onboarding.skip')}
          </Text>
        </TouchableOpacity>
      </HStack>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="flex-grow pb-8"
      >
        <OnboardingSlide slide={currentSlideData} />
      </ScrollView>

      <OnboardingNavigation
        currentSlide={currentSlide}
        totalSlides={slides.length}
        isFirstSlide={isFirstSlide}
        isLastSlide={isLastSlide}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </Box>
  );
};
