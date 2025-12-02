import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
import i18n from '@/i18n';
import { HomeImages } from '@/utils/assets';
import { Image } from 'react-native';
import { styles } from './HeroSection.styles';

export const HeroSection: React.FC = () => {
  const layout = useDeviceLayout();
  const heroHeight = layout.isTablet ? (layout.isLandscape ? 280 : 240) : 180;

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
          resizeMode='cover'
          style={[styles.heroImage, { height: heroHeight }]}
          blurRadius={3}
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
};

