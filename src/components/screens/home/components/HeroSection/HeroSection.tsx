import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { HomeImages } from '@/utils/assets';
import { useThemeMode } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Image, StyleSheet } from 'react-native';

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

const styles = StyleSheet.create({
  heroCard: {
    margin: 16,
    marginBottom: 8,
  },
  heroContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 180,
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayText: {
    textAlign: 'center',
    marginBottom: 12,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
});
