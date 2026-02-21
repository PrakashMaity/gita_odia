import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  primary?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onPress,
  primary = false
}) => {
  const theme = useThemeColors();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.buttonWrapper}
    >
      <ThemedCard
        variant="card"
        style={[
          styles.button,
          ...(primary ? [{ backgroundColor: theme.status.success + '10' }] : [])
        ]}
        borderVariant={primary ? "primary" : "none"}
      >
        <View style={[styles.iconContainer, { backgroundColor: primary ? theme.status.success + '20' : theme.background.tertiary }]}>
          <Ionicons
            name={icon}
            size={24}
            color={primary ? theme.status.success : theme.icon.primary}
          />
        </View>
        <ThemedLanguageText
          variant={primary ? "primary" : "secondary"}
          size="small"
          style={styles.label}
          fontFamily="regional_secondary"
        >
          {label}
        </ThemedLanguageText>
      </ThemedCard>
    </TouchableOpacity>
  );
};

export const QuickActionButtons: React.FC = () => {
  const handleStartReading = () => {
    router.push('/(tabs)/chapters');
  };

  const handleViewProgress = () => {
    router.push('/(tabs)/chapters');
  };

  const handleVerseOfDay = () => {
    router.push('/verse-of-the-day');
  };

  return (
    <View style={styles.container}>
      <QuickActionButton
        icon="book"
        label="পাঠ শুরু করুন"
        onPress={handleStartReading}
        primary={true}
      />
      <QuickActionButton
        icon="stats-chart"
        label="অগ্রগতি"
        onPress={handleViewProgress}
      />
      <QuickActionButton
        icon="sparkles"
        label="আজকের শ্লোক"
        onPress={handleVerseOfDay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.md,
    minHeight: 100,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
});
