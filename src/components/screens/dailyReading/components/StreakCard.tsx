import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
}) => {
  return (
    <ThemedCard variant="secondary" style={styles.card} borderVariant="primary">
      <ThemedLanguageText
        variant="primary"
        size="title"
        style={styles.fireIcon}
        fontFamily="regional_secondary"
      >
        🔥
      </ThemedLanguageText>
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
        size="medium"
        style={styles.streakLabel}
        fontFamily="regional_secondary"
      >
        {currentStreak === 1 ? 'দিন' : 'দিনের ধারাবাহিকতা'}
      </ThemedLanguageText>
      {longestStreak > currentStreak && (
        <ThemedLanguageText
          variant="secondary"
          size="small"
          style={styles.longestStreak}
          fontFamily="regional_secondary"
        >
          সর্বোচ্চ: {longestStreak} দিন
        </ThemedLanguageText>
      )}
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    padding: SIZES.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    marginTop: SIZES.spacing.lg,
  },
  fireIcon: {
    fontSize: 48,
    marginBottom: SIZES.spacing.xs,
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: '800',
    marginBottom: SIZES.spacing.xs,
  },
  streakLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  longestStreak: {
    fontSize: 14,
    marginTop: SIZES.spacing.xs,
    opacity: 0.8,
  },
});
