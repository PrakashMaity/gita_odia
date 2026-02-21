import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';

interface TimerControlsProps {
  timerState: 'idle' | 'running' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  const theme = useThemeColors();

  return (
    <View style={styles.container}>
      {timerState === 'idle' && (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.button.primary.background }]}
          onPress={onStart}
        >
          <Ionicons name="play" size={SIZES.icon.lg} color={theme.button.primary.text} />
          <ThemedLanguageText
            variant="primary"
            size="large"
            style={[styles.buttonText, { color: theme.button.primary.text }]}
            fontFamily="regional_secondary"
          >
            {i18n.t('readingTimer.start')}
          </ThemedLanguageText>
        </TouchableOpacity>
      )}

      {timerState === 'running' && (
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.status.warning }]}
            onPress={onPause}
          >
            <Ionicons name="pause" size={SIZES.icon.md} color={theme.text.primary} />
            <ThemedLanguageText
              variant="primary"
              size="medium"
              style={[styles.buttonText, { color: theme.text.primary }]}
              fontFamily="regional_secondary"
            >
              {i18n.t('readingTimer.pause')}
            </ThemedLanguageText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.status.error }]}
            onPress={onReset}
          >
            <Ionicons name="stop" size={SIZES.icon.md} color={theme.text.primary} />
            <ThemedLanguageText
              variant="primary"
              size="medium"
              style={[styles.buttonText, { color: theme.text.primary }]}
              fontFamily="regional_secondary"
            >
              {i18n.t('readingTimer.reset')}
            </ThemedLanguageText>
          </TouchableOpacity>
        </View>
      )}

      {timerState === 'paused' && (
        <View style={styles.controlsRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.status.success }]}
            onPress={onResume}
          >
            <Ionicons name="play" size={SIZES.icon.md} color={theme.text.primary} />
            <ThemedLanguageText
              variant="primary"
              size="medium"
              style={[styles.buttonText, { color: theme.text.primary }]}
              fontFamily="regional_secondary"
            >
              {i18n.t('readingTimer.resume')}
            </ThemedLanguageText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, { backgroundColor: theme.status.error }]}
            onPress={onReset}
          >
            <Ionicons name="stop" size={SIZES.icon.md} color={theme.text.primary} />
            <ThemedLanguageText
              variant="primary"
              size="medium"
              style={[styles.buttonText, { color: theme.text.primary }]}
              fontFamily="regional_secondary"
            >
              {i18n.t('readingTimer.reset')}
            </ThemedLanguageText>
          </TouchableOpacity>
        </View>
      )}

      {timerState === 'completed' && (
        <TouchableOpacity
          style={[styles.primaryButton, { backgroundColor: theme.button.secondary.background }]}
          onPress={onReset}
        >
          <Ionicons name="refresh" size={SIZES.icon.lg} color={theme.button.secondary.text} />
          <ThemedLanguageText
            variant="primary"
            size="large"
            style={[styles.buttonText, { color: theme.button.secondary.text }]}
            fontFamily="regional_secondary"
          >
            {i18n.t('readingTimer.restart')}
          </ThemedLanguageText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SIZES.spacing.xl,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.spacing.sm,
    minHeight: 56,
  },
  controlsRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.spacing.xs,
    minHeight: 48,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});

