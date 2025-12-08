import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  iconName
}) => {
  const theme = useThemeColors();

  return (
    <ThemedCard variant="card" style={styles.card} borderVariant="none">
      <View style={[styles.iconContainer, { backgroundColor: theme.status.success + '15' }]}>
        <Ionicons 
          name={iconName} 
          size={24} 
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
    padding: SIZES.spacing.lg,
    minHeight: 130,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.sm,
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
    opacity: 0.75,
  },
});
