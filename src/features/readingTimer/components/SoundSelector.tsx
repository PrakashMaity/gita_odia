import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';

type SoundType = 'none' | 'bell' | 'chime' | 'om';

interface SoundSelectorProps {
  selectedSound: SoundType;
  onSoundChange: (sound: SoundType) => void;
}

const SOUNDS: { value: SoundType; label: string; icon: string }[] = [
  { value: 'none', label: 'কোন শব্দ নেই', icon: '🔇' },
  { value: 'bell', label: 'ঘণ্টা', icon: '🔔' },
  { value: 'chime', label: 'ঝংকার', icon: '🎵' },
  { value: 'om', label: 'ওম', icon: 'ॐ' },
];

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  selectedSound,
  onSoundChange,
}) => {
  const theme = useThemeColors();
  
  return (
    <ThemedCard variant="card" style={styles.container}>
      <ThemedLanguageText
        variant="secondary"
        size="medium"
        style={styles.title}
        fontFamily="regional_secondary"
      >
        {i18n.t('readingTimer.completionSound')}
      </ThemedLanguageText>
      <View style={styles.soundsGrid}>
        {SOUNDS.map((sound) => (
          <TouchableOpacity
            key={sound.value}
            style={[
              styles.soundButton,
              {
                backgroundColor: selectedSound === sound.value 
                  ? theme.button.primary.background 
                  : theme.background.secondary,
                borderColor: selectedSound === sound.value 
                  ? theme.border.primary 
                  : theme.border.tertiary,
              },
            ]}
            onPress={() => onSoundChange(sound.value)}
          >
            <ThemedLanguageText
              variant="primary"
              size="title"
              style={styles.soundIcon}
              fontFamily="regional_secondary"
            >
              {sound.icon}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant={selectedSound === sound.value ? 'primary' : 'secondary'}
              size="small"
              style={[
                styles.soundLabel,
                selectedSound === sound.value && styles.soundLabelActive,
              ]}
              fontFamily="regional_secondary"
            >
              {sound.label}
            </ThemedLanguageText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SIZES.spacing.xl,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SIZES.spacing.md,
    textAlign: 'center',
  },
  soundsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SIZES.spacing.sm,
    justifyContent: 'center',
  },
  soundButton: {
    flex: 1,
    minWidth: 80,
    alignItems: 'center',
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
  },
  soundIcon: {
    fontSize: 32,
    marginBottom: SIZES.spacing.xs,
  },
  soundLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  soundLabelActive: {
    fontWeight: '600',
  },
});

