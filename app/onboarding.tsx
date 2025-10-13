import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { useSettingsStore } from '@/store';
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

const onboardingSlides: OnboardingSlide[] = [
  {
    id: 1,
    image: require('@/assets/images/onboarding/onboardBanner1.png'),
    title: 'ଶ୍ରୀମଦ୍ଭଗବଦ୍ଗୀତା',
    subtitle: 'ଜୀବନର ପଥପ୍ରଦର୍ଶକ',
    description: 'ପ୍ରାଚୀନ ହିନ୍ଦୁ ଧର୍ମଗ୍ରନ୍ଥମାନଙ୍କ ମଧ୍ୟରେ ଶ୍ରୀମଦ୍ଭଗବଦ୍ଗୀତା ଏକ ଅନନ୍ୟ ସ୍ଥାନ ଅଧିକାର କରିଛି। ଏହା କେବଳ ଏକ ଧର୍ମଗ୍ରନ୍ଥ ନୁହେଁ, ବରଂ ଜୀବନର ସମସ୍ତ ସମସ୍ୟାର ସମାଧାନର ପଥ ଦେଖାଏ।'
  },
  {
    id: 2,
    image: require('@/assets/images/onboarding/onboardBanner2.png'),
    title: 'ଧ୍ୟାନ ଓ ଚିନ୍ତା',
    subtitle: 'ଆଧ୍ୟାତ୍ମିକ ଜ୍ଞାନର ଭଣ୍ଡାର',
    description: 'ଗୀତାର ପ୍ରତ୍ୟେକ ଶ୍ଲୋକ ଜୀବନର ଗଭୀର ଅର୍ଥ ପ୍ରକାଶ କରେ। ଏଠାରେ ଆପଣ ପାଇବେ ଧ୍ୟାନ, ଚିନ୍ତା ଏବଂ ଆଧ୍ୟାତ୍ମିକ ଉନ୍ନତିର ନିମନ୍ତେ ଆବଶ୍ୟକ ସମସ୍ତ ଉପାଦାନ।'
  },
  {
    id: 3,
    image: require('@/assets/images/onboarding/onboardBanner3.png'),
    title: 'ଆରମ୍ଭ କରନ୍ତୁ',
    subtitle: 'ଆପଣଙ୍କର ଆଧ୍ୟାତ୍ମିକ ଯାତ୍ରା',
    description: 'ବର୍ତ୍ତମାନ ଆରମ୍ଭ କରନ୍ତୁ ଆପଣଙ୍କର ଆଧ୍ୟାତ୍ମିକ ଯାତ୍ରା। ଗୀତାର ଜ୍ଞାନର ଆଲୋକରେ ଆଲୋକିତ ହୁଅନ୍ତୁ ଏବଂ ଜୀବନର ପ୍ରତ୍ୟେକ ମୁହୂର୍ତ୍ତକୁ ଅର୍ଥବହ କରି ତୁଳନ୍ତୁ।'
  }
];

export default function OnboardingScreen() {
  const theme = useThemeColors();
  const [currentSlide, setCurrentSlide] = useState(0);
  const { updateSetting } = useSettingsStore();

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
    // Mark onboarding as complete
    updateSetting('onboardingCompleted', true);
    
    // Wait a moment for the state to persist
    await new Promise(resolve => setTimeout(resolve, 100));
    
    router.replace('/(tabs)');
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
      <StatusBar style="light" />
      
      {/* Header with Skip button */}
      <ThemedView style={styles.header}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <ThemedLanguageText variant="secondary" size="medium" fontFamily="regional_secondary">
            ଛାଡି ଯାଆନ୍ତୁ
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
              fontFamily="regional_tertiary"
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
              title="ପୂର୍ବବର୍ତ୍ତୀ"
              onPress={handlePrevious}
              variant="outline"
              size="md"
              style={styles.navButton}
            />
          )}
          
          <ThemedButton
            title={isLastSlide ? "ଆରମ୍ଭ କରନ୍ତୁ" : "ପରବର୍ତ୍ତୀ"}
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
