import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

const fonts = getLanguageFonts();

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
    <View className="px-6 py-4 pb-8">
      {/* Dot Indicators */}
      <View className="flex-row justify-center items-center mb-6 gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <DotIndicator key={index} active={index === currentSlide} />
        ))}
      </View>

      {/* Buttons */}
      <View className="flex-row items-center gap-4">
        {!isFirstSlide && (
          <Pressable
            onPress={onPrevious}
            className="flex-1 bg-primary-50 border border-primary-200 rounded-xl py-4 items-center justify-center active:opacity-80"
          >
            <Text
              className="text-primary-950 text-base font-semibold"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('onboarding.previous')}
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onNext}
          className={`bg-primary-950 rounded-xl py-4 items-center justify-center active:opacity-80 ${!isFirstSlide ? 'flex-[2]' : 'flex-1'}`}
        >
          <Text
            className="text-white text-base font-semibold"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {isLastSlide ? i18n.t('onboarding.start') : i18n.t('onboarding.next')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const DotIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  return (
    <View
      className={`h-2 rounded-full ${active ? 'w-6 bg-primary-950' : 'w-2 bg-primary-200'}`}
    />
  );
};
