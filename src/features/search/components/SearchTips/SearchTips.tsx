import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useTheme } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { styles } from './SearchTips.styles';

export const SearchTips: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={{ ...styles.tipsTitle, color: theme.text.primary }}>
        {i18n.t('search.searchTips')}
      </ThemedText>
      <ThemedView style={styles.tipsList}>
        <ThemedView style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={16} color={theme.icon.success} />
          <ThemedText style={{ ...styles.tipText, color: theme.text.secondary }}>
            {i18n.t('search.minCharacters')}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={16} color={theme.icon.success} />
          <ThemedText style={{ ...styles.tipText, color: theme.text.secondary }}>
            {i18n.t('search.searchIn')}
          </ThemedText>
        </ThemedView>
        <ThemedView style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={16} color={theme.icon.success} />
          <ThemedText style={{ ...styles.tipText, color: theme.text.secondary }}>
            {i18n.t('search.tapToGo')}
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
};

