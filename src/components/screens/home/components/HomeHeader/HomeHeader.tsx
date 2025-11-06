import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import i18n from '@/i18n';
import { HomeImages } from '@/utils/assets';
import { Image } from 'react-native';
import { styles } from './HomeHeader.styles';

export const HomeHeader: React.FC = () => {
  return (
    <ThemedCard variant='transparent' style={styles.headerCard} pattern="none">
      <ThemedView>
        <Image source={HomeImages.logo} style={styles.logo} />
      </ThemedView>
      
      <ThemedLanguageText
        variant="primary"
        size="title"
        fontFamily="regional_secondary"
      >
        {i18n.t("home.headerTitle")}
      </ThemedLanguageText>
    </ThemedCard>
  );
};
