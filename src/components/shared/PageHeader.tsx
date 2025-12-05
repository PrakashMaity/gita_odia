import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import { PageHeaderProps } from '@/interface/screen.interface';
import { SIZES } from '@/rootconstants/sizes';
import { HomeImages } from '@/utils/assets';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { styles } from './PageHeader.styles';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  onBack,
}) => {
  const theme = useThemeColors();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <ScreenHeader
      backgroundSource={HomeImages.hero}
      blurRadius={3}
      containerStyle={[
        styles.headerContainer,
        { backgroundColor: theme.background.secondary },
      ]}
      contentStyle={styles.headerContent}
      leftSectionStyle={styles.leftContent}
      rightSectionStyle={styles.rightContent}
      leftContent={
        <ThemedView style={styles.leftContent}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={handleBack}
              style={[
                styles.backButton,
                {
                  backgroundColor: theme.background.secondary,
                  borderColor: theme.border.primary,
                },
              ]}
            >
              <Ionicons name="arrow-back" size={SIZES.icon.sm} color={theme.icon.primary} />
            </TouchableOpacity>
          ) : null}

          <ThemedView style={styles.textContainer}>
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {title}
            </ThemedLanguageText>
            {subtitle ? (
              <ThemedLanguageText
                variant="secondary"
                size="small"
                fontFamily="regional_secondary"
                style={styles.subtitle}
              >
                {subtitle}
              </ThemedLanguageText>
            ) : null}
          </ThemedView>
        </ThemedView>
      }
      rightContent={
        rightAction ? (
          <ThemedView style={styles.rightContent}>
            {rightAction}
          </ThemedView>
        ) : undefined
      }
    />
  );
};

