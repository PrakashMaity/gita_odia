import { useTheme } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText/ThemedText';
import { ThemedView } from '../ThemedView/ThemedView';

interface ThemeToggleProps {
  style?: any;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ style }) => {
  const { theme, toggleMode, isDark } = useTheme();

  return (
    <ThemedView style={[styles.container, style]}>
      <ThemedText style={[styles.label, { color: theme.text.primary }]}>
        {i18n.t('theme.theme')} (Theme)
      </ThemedText>
      <TouchableOpacity
        style={[
          styles.toggleButton,
          {
            backgroundColor: theme.background.card,
            borderColor: theme.border.primary,
          },
        ]}
        onPress={toggleMode}
        activeOpacity={0.7}
      >
        <View style={styles.toggleContent}>
          <ThemedText style={[styles.modeText, { color: theme.text.primary }]}>
            {isDark ? '🌙' : '☀️'}
          </ThemedText>
          <ThemedText style={[styles.modeLabel, { color: theme.text.secondary }]}>
            {isDark ? i18n.t('theme.dark') : i18n.t('theme.light')}
          </ThemedText>
        </View>
      </TouchableOpacity>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    minWidth: 80,
    justifyContent: 'center',
  },
  toggleContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeText: {
    fontSize: 18,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
});
