import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
import i18n from '@/i18n';
import { HomeImages } from '@/utils/assets';
import { Image } from 'expo-image';
import React, { useMemo } from 'react';
import { styles } from './HeroSection.styles';

export const HeroSection: React.FC = React.memo(() => {
  const layout = useDeviceLayout();
  const heroHeight = useMemo(() => 
    layout.isTablet ? (layout.isLandscape ? 280 : 240) : 180,
    [layout.isTablet, layout.isLandscape]
  );

  return (
    <ThemedCard
      variant='primary'
      style={[styles.heroCard, layout.isTablet && styles.heroCardTablet]}
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
          <ThemedLanguageText
            variant="primary"
            size="xxl"
            fontFamily="regional_secondary"
            style={styles.overlayText}
          >
            {i18n.t('home.heroQuote')}
          </ThemedLanguageText>
        </ThemedView>
      </ThemedView>
    </ThemedCard>
  );
});

