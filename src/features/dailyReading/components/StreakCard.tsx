import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const theme = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
  };

  return (
    <Animated.View style={animatedStyle}>
      <ThemedCard variant="card" style={styles.card}>
        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: theme.status.warning + '15' }]}>
            <Ionicons 
              name="flame" 
              size={40} 
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
            variant="secondary"
            size="medium"
            style={styles.streakLabel}
            fontFamily="regional_secondary"
          >
            {i18n.t('dailyReading.streakLabel')}
          </ThemedLanguageText>
          
          {longestStreak > currentStreak && (
            <View style={styles.longestStreakContainer}>
              <Ionicons 
                name="trophy-outline" 
                size={16} 
                color={theme.icon.secondary} 
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
        </View>
      </ThemedCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.xl,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.md,
  },
  streakNumber: {
    fontSize: 56,
    fontWeight: '700',
    marginBottom: SIZES.spacing.xs,
    textAlign: 'center',
  },
  streakLabel: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    opacity: 0.8,
  },
  longestStreakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.spacing.xs,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.md,
    gap: SIZES.spacing.xs,
  },
  longestStreak: {
    fontSize: 13,
    opacity: 0.7,
  },
});
