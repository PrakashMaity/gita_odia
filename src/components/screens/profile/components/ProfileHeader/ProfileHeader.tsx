import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React, { useCallback, useRef, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './ProfileHeader.styles';

interface ProfileHeaderProps {
  onDeveloperButtonPress?: () => void;
  showDeveloperButton?: boolean;
  onDeveloperButtonClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onDeveloperButtonPress,
  showDeveloperButton = false,
  onDeveloperButtonClick,
}) => {
  const theme = useThemeColors();
  const { isPro } = useProStatus();
  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const REQUIRED_TAPS = 10;

  const handleTitlePress = useCallback(() => {
    // Clear existing timeout
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    // Reset tap count after 2 seconds of inactivity
    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount >= REQUIRED_TAPS) {
      setTapCount(0);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      // Trigger parent to show developer button
      if (onDeveloperButtonPress) {
        onDeveloperButtonPress();
      }
    }
  }, [tapCount, onDeveloperButtonPress]);

  React.useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <ScreenHeader
      leftContent={
        <ThemedView style={styles.titleContainer}>
          <ThemedView style={styles.titleRow}>
            <TouchableOpacity
              onPress={handleTitlePress}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="primary_english"
                style={[styles.title, { color: theme.text.primary }]}
              >
                Settings
              </ThemedLanguageText>
              {isPro && (
                <ThemedView style={[styles.proBadge, { backgroundColor: theme.button.primary.background }]}>
                  <ThemedLanguageText
                    variant="primary"
                    size="xs"
                    fontFamily="regional_secondary"
                    style={[styles.proText, { color: theme.button.primary.text }]}
                  >
                    PRO
                  </ThemedLanguageText>
                </ThemedView>
              )}
            </TouchableOpacity>
          </ThemedView>
          <ThemedLanguageText
            variant="secondary"
            size="small"
            fontFamily="regional_secondary"
            style={[styles.subtitle, { color: theme.text.secondary }]}
          >
            {i18n.t('profile.customizeExperience')}
          </ThemedLanguageText>
        </ThemedView>
      }
      rightContent={
        showDeveloperButton ? (
          <ThemedButton
            title="Developer"
            onPress={onDeveloperButtonClick || onDeveloperButtonPress || (() => {})}
            variant="outline"
            icon={<MaterialIcons name="code" size={SIZES.icon.sm} color={theme.icon.primary} />}
            style={{ paddingHorizontal: SIZES.spacing.sm }}
          />
        ) : null
      }
      containerStyle={{ backgroundColor: theme.background.secondary }}
    />
  );
};
