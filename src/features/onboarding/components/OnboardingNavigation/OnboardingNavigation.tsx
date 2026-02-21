import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import React from 'react';
import { styles } from './OnboardingNavigation.styles';

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
  const theme = useThemeColors();

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.pageIndicators}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <ThemedView
            key={index}
            style={[
              styles.indicator,
              {
                backgroundColor: index === currentSlide 
                  ? theme.button.primary.background 
                  : theme.border.tertiary,
                width: index === currentSlide ? 24 : 8,
              }
            ]}
          />
        ))}
      </ThemedView>

      <ThemedView style={styles.navigationButtons}>
        {!isFirstSlide && (
          <ThemedButton
            title={i18n.t('onboarding.previous')}
            onPress={onPrevious}
            variant="outline"
            size="md"
            style={styles.navButton}
          />
        )}
        
        <ThemedButton
          title={isLastSlide ? i18n.t('onboarding.start') : i18n.t('onboarding.next')}
          onPress={onNext}
          variant="primary"
          size="md"
          style={styles.primaryButton}
        />
      </ThemedView>
    </ThemedView>
  );
};

