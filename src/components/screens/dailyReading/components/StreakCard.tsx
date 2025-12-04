import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const theme = useThemeColors();

  return (
    <ThemedCard variant="secondary" style={styles.card} borderVariant="primary">
      <View style={[styles.iconContainer, { backgroundColor: theme.status.warning + '20' }]}>
        <Ionicons 
          name="flame" 
          size={SIZES.icon.xxl} 
          color={theme.status.warning} 
        />
      </View>
      <ThemedLanguageText
        variant="primary"
        size="title"
        style={styles.streakNumber}
        fontFamily="regional_secondary"
      >
        {currentStreak}
      </ThemedLanguageText>
      <ThemedLanguageText
        variant="primary"
        size="large"
        style={styles.streakLabel}
        fontFamily="regional_secondary"
      >
        {i18n.t('dailyReading.streakLabel')}
      </ThemedLanguageText>
      {longestStreak > currentStreak && (
        <View style={styles.longestStreakContainer}>
          <Ionicons 
            name="trophy-outline" 
            size={SIZES.icon.sm} 
            color={theme.icon.secondary} 
            style={styles.trophyIcon}
          />
          <ThemedLanguageText
            variant="secondary"
            size="small"
            style={styles.longestStreak}
            fontFamily="regional_secondary"
          >
            {i18n.t('dailyReading.longestStreakLabel', { count: longestStreak })}
          </ThemedLanguageText>
        </View>
      )}
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: SIZES.spacing.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    marginTop: SIZES.spacing.lg,
  },
  iconContainer: {
    width: SIZES.spacing.xxxl * 2,
    height: SIZES.spacing.xxxl * 2,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.md,
  },
  streakNumber: {
    fontSize: 64,
    fontWeight: '800',
    marginBottom: SIZES.spacing.xs,
    textAlign: 'center',
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  longestStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.md,
  },
  trophyIcon: {
    marginRight: SIZES.spacing.xs,
  },
  longestStreak: {
    fontSize: 14,
    opacity: 0.9,
  },
});
