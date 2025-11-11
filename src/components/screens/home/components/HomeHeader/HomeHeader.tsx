import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { HomeImages } from '@/utils/assets';
import { Image, ImageBackground, TouchableOpacity, View } from 'react-native';
import { styles } from './HomeHeader.styles';

export const HomeHeader: React.FC = () => {
  const theme = useThemeColors();
  const headerAccentColor = theme.background.tertiary;
  const headerIcons = HomeImages.headerIcons;
  const iconBackgroundColor = theme.background.secondary;

  return (
    <View style={[styles.headerContainer, { backgroundColor: theme.background.secondary }]}>
      <ImageBackground
        source={HomeImages.header}
        style={styles.headerBackground}
        imageStyle={styles.headerImage}
        resizeMode="cover"
        blurRadius={2}
      >
        <ThemedView style={styles.headerContent}>
          <ThemedView style={styles.leftSection}>
            <Image source={HomeImages.logo} style={styles.logo} />
            <ThemedLanguageText
              variant="primary"
              size="title"
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {i18n.t("home.headerTitle")}
            </ThemedLanguageText>
          </ThemedView>

          <ThemedView style={styles.iconGroup}>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]}>
              <Image source={headerIcons.mic} style={[styles.icon, { tintColor: headerAccentColor }]} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: iconBackgroundColor }]}>
              <Image source={headerIcons.notification} style={[styles.icon, { tintColor: headerAccentColor }]} />
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>
      </ImageBackground>
    </View>
  );
};
