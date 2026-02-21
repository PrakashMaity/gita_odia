import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { Image } from 'expo-image';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';
import { styles } from './HeroSection.styles';

export const HeroSection: React.FC = React.memo(() => {
  const layout = useDeviceLayout();
  const heroQuotes = i18n.t('home.heroQuotes') as string[];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];

  const heroHeight = useMemo(() => 
    layout.isTablet ? (layout.isLandscape ? 280 : 240) : 180,
    [layout.isTablet, layout.isLandscape]
  );

  const cardStyle = useMemo(() => 
    layout.isTablet 
      ? [styles.heroCard, styles.heroCardTablet]
      : [styles.heroCard],
    [layout.isTablet]
  );

  // Rotate quotes every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        // Change quote
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % heroQuotes.length);
        // Fade in
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [heroQuotes.length, fadeAnim]);

  const currentQuote = heroQuotes[currentQuoteIndex] || heroQuotes[0];
  // Using decorative curly quotation marks
  const quotedText = `\u201C${currentQuote}\u201D`;

  return (
    <ThemedCard
      variant='primary'
      style={cardStyle}
      pattern="sacredGeometry"
      patternOpacity={0.15}
    >
      <ThemedView style={styles.heroContainer}>
        <Image
          source={HomeImages.hero}
          contentFit='cover'
          style={[styles.heroImage, { height: heroHeight }]}
          blurRadius={3}
          transition={200}
          cachePolicy="memory-disk"
        />
        <ThemedView style={styles.textOverlay}>
          <Animated.View style={{ opacity: fadeAnim }}>
            <ThemedLanguageText
              variant="primary"
              size="xxl"
              fontFamily="regional_secondary"
              style={styles.overlayText}
            >
              {quotedText}
            </ThemedLanguageText>
          </Animated.View>
        </ThemedView>
      </ThemedView>
    </ThemedCard>
  );
});

HeroSection.displayName = 'HeroSection';
