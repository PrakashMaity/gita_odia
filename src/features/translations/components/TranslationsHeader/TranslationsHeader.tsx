import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './TranslationsHeader.styles';

export const TranslationsHeader: React.FC = () => {
  const theme = useThemeColors();

  return (
    <ScreenHeader
      containerStyle={{ backgroundColor: theme.background.secondary }}
      leftContent={
        <ThemedView style={styles.leftContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.background.secondary }]}
          >
            <Ionicons name="arrow-back" size={SIZES.icon.sm} color={theme.icon.primary} />
          </TouchableOpacity>

          <ThemedLanguageText
            variant="primary"
            size="title"
            fontFamily="regional_secondary"
            style={styles.title}
          >
            {i18n.t('menu.translations')}
          </ThemedLanguageText>
        </ThemedView>
      }
      rightContent={
        <ThemedView
          style={[
            styles.actionButton,
            {
              backgroundColor: theme.background.secondary,
              borderColor: theme.border.primary,
            },
          ]}
        >
          <MaterialIcons name="translate" size={SIZES.icon.sm} color={theme.icon.primary} />
        </ThemedView>
      }
    />
  );
};

