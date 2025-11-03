import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { HomeImages } from '@/utils/assets';
import { FontAwesome } from '@expo/vector-icons';
import { Image, TouchableOpacity } from 'react-native';
import { styles } from './HomeHeader.styles';

interface HomeHeaderProps {
  isNotificationVisible: boolean;
  hasNotification: boolean;
  onBellPress: () => void;
}

export const HomeHeader: React.FC<HomeHeaderProps> = ({
  isNotificationVisible,
  hasNotification,
  onBellPress,
}) => {
  const theme = useThemeColors();

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

      <ThemedView style={styles.headerActions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            {
              borderColor: theme.border.primary,
              backgroundColor: isNotificationVisible ? theme.button.primary.background : 'transparent'
            }
          ]}
          onPress={onBellPress}
          testID="bell-icon"
        >
          <FontAwesome
            name={isNotificationVisible ? "bell" : "bell-o"}
            size={SIZES.icon.xs}
            color={isNotificationVisible ? theme.button.primary.text : (hasNotification ? theme.status.warning : theme.icon.primary)}
          />
          {hasNotification && !isNotificationVisible && (
            <ThemedView style={[styles.notificationDot, { backgroundColor: theme.status.error }]} />
          )}
        </TouchableOpacity>
      </ThemedView>
    </ThemedCard>
  );
};
