import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { OnboardingSlide } from '@/interface/screen.interface';
import { useSettingsStore } from '@/store';
import { OnboardingImages } from '@/utils/assets';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Dimensions, Image, ScrollView, TouchableOpacity } from 'react-native';
import { styles } from './OnboardingScreen.styles';

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

export const OnboardingScreen: React.FC = () => {
  const theme = useThemeColors();
  const { isDark } = useTheme();
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
      updateSetting('onboardingCompleted', true);
      await new Promise(resolve => setTimeout(resolve, 500));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
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

        <ThemedCard variant="primary" style={styles.contentCard}>
          <ThemedView style={styles.contentContainer}>
            <ThemedLanguageText 
              variant="primary" 
              size="title" 
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {currentSlideData.title}
            </ThemedLanguageText>

            <ThemedLanguageText 
              variant="secondary" 
              size="xl" 
              fontFamily="regional_secondary"
              style={styles.subtitle}
            >
              {currentSlideData.subtitle}
            </ThemedLanguageText>

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

      <ThemedView style={styles.bottomContainer}>
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
};
