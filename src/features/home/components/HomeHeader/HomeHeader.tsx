import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { router } from 'expo-router';
import { Image, TouchableOpacity, View } from 'react-native';
import { styles } from './HomeHeader.styles';

export const HomeHeader: React.FC = () => {
  const theme = useThemeColors();
  const headerAccentColor = theme.background.tertiary;
  const headerIcons = HomeImages.headerIcons;
  const iconBackgroundColor = theme.background.secondary;
  const { isPro } = useProStatus();

  const handleNotificationPress = () => {
    router.push('/notifications');
  };

  return (
    <ScreenHeader
      leftContent={
        <ThemedView style={styles.leftSection}>
          <Image source={HomeImages.logo} style={styles.logo} />
          <View style={styles.titleContainer}>
            <ThemedLanguageText
              variant="primary"
              size="title"
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {i18n.t('home.headerTitle')}
            </ThemedLanguageText>
            {isPro && (
              <View style={[styles.proBadge, { backgroundColor: theme.button.primary.background }]}>
                <ThemedLanguageText
                  variant="primary"
                  size="xs"
                  fontFamily="regional_secondary"
                  style={[styles.proText, { color: theme.button.primary.text }]}
                >
                  PRO
                </ThemedLanguageText>
              </View>
            )}
          </View>
        </ThemedView>
      }
      rightContent={
        <ThemedView style={styles.iconGroup}>
          {/* <TouchableOpacity style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]}>
            <Image source={headerIcons.mic} style={[styles.icon, { tintColor: headerAccentColor }]} />
          </TouchableOpacity> */}
          <TouchableOpacity 
            style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]}
            onPress={handleNotificationPress}
          >
            <Image source={headerIcons.notification} style={[styles.icon, { tintColor: headerAccentColor }]} />
          </TouchableOpacity>
        </ThemedView>
      }
    />
  );
};
