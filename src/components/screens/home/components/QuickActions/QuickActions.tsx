import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { MenuItem } from '@/constants/menuData';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { HomeImages } from '@/utils/assets';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { ImageBackground } from 'react-native';
import { getNavigationHandler } from '../../navigationHandlers';
import { styles } from './QuickActions.styles';

export const QuickActions: React.FC = () => {
  const theme = useThemeColors();
  const quickActionTextColor = theme.text.primary;
  const quickActionIconColor = theme.icon.primary;

  return (
    <ThemedCard variant='primary' pattern='sacredGeometry' style={styles.quickActionsCard}>
      <ImageBackground
        source={HomeImages.buttonBackground}
        style={styles.actionBackground}
        imageStyle={styles.actionBackgroundImage}
        blurRadius={4}
      >
        <ThemedButton
          title={i18n.t('gitaSummary.title')}
          onPress={() => {
            getNavigationHandler({ id: 'gita-summary' } as MenuItem)();
          }}
          variant="basic"
          size="md"
          fullWidth
          style={styles.actionButton}
          textStyle={{ ...styles.actionText, color: quickActionTextColor }}
          icon={<FontAwesome6 name="book-bookmark" size={SIZES.icon.lg} color={quickActionIconColor} />}
        />
      </ImageBackground>

      <ImageBackground
        source={HomeImages.buttonBackground}
        style={styles.actionBackground}
        imageStyle={styles.actionBackgroundImage}
        blurRadius={4}
      >
        <ThemedButton
          title={i18n.t('gitaMahatmya.title')}
          onPress={() => {
            getNavigationHandler({ id: 'gita-mahatmya' } as MenuItem)();
          }}
          variant="basic"
          size="md"
          fullWidth
          style={styles.actionButton}
          textStyle={{ ...styles.actionText, color: quickActionTextColor }}
          icon={<FontAwesome5 name="book" size={SIZES.icon.lg} color={quickActionIconColor} />}
        />
      </ImageBackground>
    </ThemedCard>
  );
};
