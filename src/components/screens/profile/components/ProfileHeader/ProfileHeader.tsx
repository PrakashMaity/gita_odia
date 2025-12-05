import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { View } from 'react-native';
import { styles } from './ProfileHeader.styles';

export const ProfileHeader: React.FC = () => {
  const theme = useThemeColors();
  const { isPro } = useProStatus();

  return (
    <ScreenHeader
      leftContent={
        <ThemedView style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="none"
              style={[styles.title, { color: theme.text.primary }]}
            >
              Settings
            </ThemedLanguageText>
            {isPro && (
              <ThemedLanguageText
                variant="accent"
                size="large"
                fontFamily="regional_secondary"
                style={styles.proText}
              >
                {' PRO'}
              </ThemedLanguageText>
            )}
          </View>
          <ThemedLanguageText
            variant="secondary"
            size="small"
            fontFamily="none"
            style={[styles.subtitle, { color: theme.text.secondary }]}
          >
            Customize your Bhagavad Gita experience
          </ThemedLanguageText>
        </ThemedView>
      }
      containerStyle={{ backgroundColor: theme.background.secondary }}
    />
  );
};
