import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { styles } from './TranslationsHeader.styles';

export const TranslationsHeader: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ThemedCard variant='transparent' style={styles.headerCard}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={SIZES.icon.xl} color={theme.icon.primary} />
      </TouchableOpacity>

      <ThemedLanguageText
        variant="primary"
        size="title"
        fontFamily="regional_secondary"
        style={styles.title}
      >
        {i18n.t('menu.translations')}
      </ThemedLanguageText>
      <ThemedView style={styles.headerActions}>
        <ThemedView style={[styles.actionButton, { borderColor: theme.border.primary }]}>
          <MaterialIcons
            name="translate"
            size={SIZES.icon.md}
            color={theme.icon.primary}
          />
        </ThemedView>
      </ThemedView>
    </ThemedCard>
  );
};

