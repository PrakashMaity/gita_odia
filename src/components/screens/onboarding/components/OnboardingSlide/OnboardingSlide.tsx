import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { OnboardingSlide as OnboardingSlideType } from '@/interface/screen.interface';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image } from 'react-native';
import { styles } from './OnboardingSlide.styles';

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide }) => {
  return (
    <>
      <ThemedCard variant="transparent" style={styles.imageCard}>
        <ThemedView style={styles.imageContainer}>
          <Image 
            source={slide.image} 
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
            {slide.title}
          </ThemedLanguageText>

          <ThemedLanguageText 
            variant="secondary" 
            size="xl" 
            fontFamily="regional_secondary"
            style={styles.subtitle}
          >
            {slide.subtitle}
          </ThemedLanguageText>

          <ThemedLanguageText 
            variant="tertiary" 
            size="large" 
            fontFamily="regional_secondary"
            style={styles.description}
          >
            {slide.description}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedCard>
    </>
  );
};

