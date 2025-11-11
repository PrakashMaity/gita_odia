import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import { HomeImages } from '@/utils/assets';
import { Image } from 'react-native';
import { styles } from './HeroSection.styles';

export const HeroSection: React.FC = () => {
  return (
    <ThemedCard variant='primary' style={styles.heroCard} pattern="sacredGeometry" patternOpacity={0.15}>
      <ThemedView style={styles.heroContainer}>
        <Image
          source={HomeImages.hero}
          resizeMode='cover'
          style={styles.heroImage}
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

