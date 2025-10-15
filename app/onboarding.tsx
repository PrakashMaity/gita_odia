import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { useSettingsStore } from '@/store';
import { OnboardingImages } from '@/utils/assets';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  image: any;
  title: string;
  subtitle: string;
  description: string;
}

const getOnboardingSlides = (): OnboardingSlide[] => [
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
];

export default function OnboardingScreen() {
  const theme = useThemeColors();
  const {isDark} = useTheme();

  const [currentSlide, setCurrentSlide] = useState(0);
  const { updateSetting } = useSettingsStore();
  const onboardingSlides = getOnboardingSlides();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = async () => {
    try {
      // Mark onboarding as complete
      updateSetting('onboardingCompleted', true);
      
      // Wait for the state to persist properly
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Navigate to tabs
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      // Fallback navigation
      router.replace('/(tabs)');
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = onboardingSlides[currentSlide];
  const isLastSlide = currentSlide === onboardingSlides.length - 1;
  const isFirstSlide = currentSlide === 0;

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background.primary }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      {/* Header with Skip button */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <ThemedLanguageText variant="secondary" size="medium" fontFamily="regional_secondary">
            {i18n.t('onboarding.skip')}
          </ThemedLanguageText>
        </TouchableOpacity>
      </ThemedView>

      {/* Main Content */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Image Container */}
        <ThemedCard variant="transparent" style={styles.imageCard}>
          <ThemedView style={styles.imageContainer}>
            <Image 
              source={currentSlideData.image} 
              style={styles.onboardingImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.3)']}
              style={styles.imageGradient}
            />
          </ThemedView>
        </ThemedCard>

        {/* Content Card */}
        <ThemedCard variant="primary" style={styles.contentCard}>
          <ThemedView style={styles.contentContainer}>
            {/* Title */}
            <ThemedLanguageText 
              variant="primary" 
              size="title" 
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {currentSlideData.title}
            </ThemedLanguageText>

            {/* Subtitle */}
            <ThemedLanguageText 
              variant="secondary" 
              size="xl" 
              fontFamily="regional_secondary"
              style={styles.subtitle}
            >
              {currentSlideData.subtitle}
            </ThemedLanguageText>

            {/* Description */}
            <ThemedLanguageText 
              variant="tertiary" 
              size="large" 
              fontFamily="regional_secondary"
              style={styles.description}
            >
              {currentSlideData.description}
            </ThemedLanguageText>
          </ThemedView>
        </ThemedCard>
      </ScrollView>

      {/* Bottom Navigation */}
      <ThemedView style={styles.bottomContainer}>
        {/* Page Indicators */}
        <ThemedView style={styles.pageIndicators}>
          {onboardingSlides.map((_, index) => (
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

        {/* Navigation Buttons */}
        <ThemedView style={styles.navigationButtons}>
          {!isFirstSlide && (
            <ThemedButton
              title={i18n.t('onboarding.previous')}
              onPress={handlePrevious}
              variant="outline"
              size="md"
              style={styles.navButton}
            />
          )}
          
          <ThemedButton
            title={isLastSlide ? i18n.t('onboarding.start') : i18n.t('onboarding.next')}
            onPress={handleNext}
            variant="primary"
            size="md"
            style={styles.primaryButton}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  skipButton: {
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.spacing.xl,
  },
  imageCard: {
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: SIZES.radius.xl,
    overflow: 'hidden',
    height: height * 0.4,
  },
  onboardingImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  contentCard: {
    margin: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
    opacity: 0.9,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
    gap: SIZES.spacing.sm,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});
