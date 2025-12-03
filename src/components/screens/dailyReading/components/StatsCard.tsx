import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';

interface StatsCardProps {
  title: string;
  value: string;
  icon: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon }) => {
  return (
    <ThemedCard variant="card" style={styles.card}>
      <ThemedLanguageText
        variant="primary"
        size="title"
        style={styles.icon}
        fontFamily="regional_secondary"
      >
        {icon}
      </ThemedLanguageText>
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
    minHeight: 120,
  },
  icon: {
    fontSize: 32,
    marginBottom: SIZES.spacing.xs,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SIZES.spacing.xs,
    textAlign: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
});

