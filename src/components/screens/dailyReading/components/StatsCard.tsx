import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';

interface StatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, iconName }) => {
  const theme = useThemeColors();

  return (
    <ThemedCard variant="card" style={styles.card} borderVariant="primary">
      <View style={[styles.iconContainer, { backgroundColor: theme.status.success + '20' }]}>
        <Ionicons 
          name={iconName} 
          size={SIZES.icon.lg} 
          color={theme.status.success} 
        />
      </View>
      <ThemedLanguageText
        variant="primary"
        size="title"
        style={styles.value}
        fontFamily="regional_secondary"
      >
        {value}
      </ThemedLanguageText>
      <ThemedLanguageText
        variant="secondary"
        size="small"
        style={styles.title}
        fontFamily="regional_secondary"
      >
        {title}
      </ThemedLanguageText>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 140,
    paddingVertical: SIZES.spacing.lg,
  },
  iconContainer: {
    width: SIZES.spacing.xxxl * 1.5,
    height: SIZES.spacing.xxxl * 1.5,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.md,
  },
  value: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: SIZES.spacing.xs,
    textAlign: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 18,
  },
});

