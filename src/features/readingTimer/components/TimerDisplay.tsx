import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';

interface TimerDisplayProps {
  timeLeft: number;
  timerState: 'idle' | 'running' | 'paused' | 'completed';
  formatTime: (seconds: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  timerState,
  formatTime,
}) => {
  const theme = useThemeColors();
  
  const getDisplayColor = () => {
    switch (timerState) {
      case 'running':
        return theme.status.success;
      case 'paused':
        return theme.status.warning;
      case 'completed':
        return theme.icon.tertiary;
      default:
        return theme.icon.disabled;
    }
  };

  return (
    <View style={styles.container}>
      <ThemedCard variant="card" style={[styles.circle, { borderColor: getDisplayColor(), borderWidth: 8 }]}>
        <ThemedLanguageText
          variant="primary"
          size="title"
          style={[styles.timeText, { color: getDisplayColor() }]}
          fontFamily="regional_secondary"
        >
          {formatTime(timeLeft)}
        </ThemedLanguageText>
        <ThemedLanguageText
          variant="secondary"
          size="small"
          style={styles.stateText}
          fontFamily="regional_secondary"
        >
          {timerState === 'running' ? 'চলছে...' : 
           timerState === 'paused' ? 'বিরতি' :
           timerState === 'completed' ? 'সম্পন্ন' : 'প্রস্তুত'}
        </ThemedLanguageText>
      </ThemedCard>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.xl,
    marginBottom: SIZES.spacing.lg,
  },
  circle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    margin: 0,
  },
  timeText: {
    fontSize: 64,
    fontWeight: '800',
    marginBottom: SIZES.spacing.xs,
  },
  stateText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

