import { ScreenHeader } from '@/components/screens/shared/ScreenHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { SIZES } from '@/rootconstants/sizes';
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
              size="xxl"
              fontFamily="regional_secondary"
              style={styles.title}
            >
              {i18n.t('profile.settings')}
            </ThemedLanguageText>
            {isPro && (
              <ThemedLanguageText
                variant="accent"
                size="xxl"
                fontFamily="regional_secondary"
                style={styles.proText}
              >
                {' PRO'}
              </ThemedLanguageText>
            )}
          </View>
          <ThemedLanguageText
            variant="secondary"
            size="medium"
            fontFamily="regional_secondary"
            style={styles.subtitle}
          >
            {i18n.t('profile.customizeExperience')}
          </ThemedLanguageText>
        </ThemedView>
      }
      containerStyle={{ backgroundColor: theme.background.secondary }}
    />
  );
};
