import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import i18n from '@/lib/i18n';
import React from 'react';

interface OnboardingNavigationProps {
  currentSlide: number;
  totalSlides: number;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentSlide,
  totalSlides,
  isFirstSlide,
  isLastSlide,
  onPrevious,
  onNext,
}) => {
  return (
    <Box className="px-6 py-6 pb-8">
      <HStack className="justify-center items-center mb-8 gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <Box
            key={index}
            className={`h-2 rounded-full ${index === currentSlide ? 'bg-white w-6' : 'bg-neutral-800 w-2'
              }`}
          />
        ))}
      </HStack>

      <HStack className="justify-between items-center gap-4">
        {!isFirstSlide && (
          <Button
            onPress={onPrevious}
            variant="outline"
            size="md"
            className="flex-1 bg-neutral-800 border border-neutral-700 rounded-xl py-4"
          >
            <ButtonText className="text-white font-semibold">
              {i18n.t('onboarding.previous')}
            </ButtonText>
          </Button>
        )}

        <Button
          onPress={onNext}
          size="md"
          className="flex-2 bg-white rounded-xl py-4"
        >
          <ButtonText className="text-black font-semibold">
            {isLastSlide ? i18n.t('onboarding.start') : i18n.t('onboarding.next')}
          </ButtonText>
        </Button>
      </HStack>
    </Box>
  );
};

