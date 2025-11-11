import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { OnboardingNavigation } from './components/OnboardingNavigation';
import { OnboardingSlide } from './components/OnboardingSlide';
import { useOnboardingData } from './hooks/useOnboardingData';
import { useOnboardingNavigation } from './hooks/useOnboardingNavigation';
import { styles } from './OnboardingScreen.styles';

export const OnboardingScreen: React.FC = () => {
  const theme = useThemeColors();
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
    <ThemedView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <ThemedLanguageText variant="secondary" size="medium" fontFamily="regional_secondary">
            {i18n.t('onboarding.skip')}
          </ThemedLanguageText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
    </ThemedView>
  );
};
