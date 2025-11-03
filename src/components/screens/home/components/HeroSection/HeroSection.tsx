import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { HomeImages } from '@/utils/assets';
import { useThemeMode } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Image } from 'react-native';
import { styles } from './HeroSection.styles';

export const HeroSection: React.FC = () => {
  const { isDark } = useThemeMode();

  return (
    <ThemedCard variant='primary' style={styles.heroCard} pattern="sacredGeometry" patternOpacity={0.15}>
      <ThemedView style={styles.heroContainer}>
        <Image 
          source={isDark ? HomeImages.heroDark : HomeImages.hero} 
          resizeMode='cover' 
          style={styles.heroImage} 
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

