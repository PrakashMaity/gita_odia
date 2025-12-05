import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface ChapterStatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
}

export const ChapterStatsCard: React.FC<ChapterStatsCardProps> = ({ 
  title, 
  value, 
  iconName,
  iconColor 
}) => {
  const theme = useThemeColors();
  const iconColorValue = iconColor || theme.status.success;

  return (
    <ThemedCard variant="card" style={styles.card} borderVariant="primary">
      <View style={[styles.iconContainer, { backgroundColor: iconColorValue + '20' }]}>
        <MaterialIcons 
          name={iconName} 
          size={SIZES.icon.lg} 
          color={iconColorValue} 
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
    minHeight: 120,
    paddingVertical: SIZES.spacing.lg,
  },
  iconContainer: {
    width: SIZES.spacing.xxxl * 1.3,
    height: SIZES.spacing.xxxl * 1.3,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.md,
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
    lineHeight: 16,
  },
});
