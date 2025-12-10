import React from 'react';
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import { useThemeColors } from '@/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

type MantraType = 'hareKrishna' | 'omNamah' | 'gitaDhyana' | 'custom';

interface MantraSelectorProps {
  selectedMantra: MantraType;
  onMantraChange: (mantra: MantraType) => void;
  isPro: boolean;
}

const mantras: { id: MantraType; key: string }[] = [
  { id: 'hareKrishna', key: 'mantras.hareKrishna' },
  { id: 'omNamah', key: 'mantras.omNamah' },
  { id: 'gitaDhyana', key: 'mantras.gitaDhyana' },
  { id: 'custom', key: 'mantras.custom' },
];

export const MantraSelector: React.FC<MantraSelectorProps> = ({
  selectedMantra,
  onMantraChange,
  isPro,
}) => {
  const theme = useThemeColors();

  const isMantraLocked = (mantraId: MantraType): boolean => {
    // First mantra (hareKrishna) is always unlocked
    if (mantraId === 'hareKrishna') {
      return false;
    }
    // Other mantras are locked if not pro
    return !isPro;
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {mantras.map((mantra) => {
          const isSelected = selectedMantra === mantra.id;
          const isLocked = isMantraLocked(mantra.id);
          return (
            <TouchableOpacity
              key={mantra.id}
              style={[
                styles.tab,
                isSelected && [
                  styles.tabActive,
                  { backgroundColor: theme.background.quaternary },
                ],
                !isSelected && styles.tabInactive,
                isLocked && styles.tabLocked,
              ]}
              onPress={() => onMantraChange(mantra.id)}
              activeOpacity={0.7}
              disabled={isLocked && !isSelected}
            >
              <View style={styles.tabContent}>
                <ThemedLanguageText
                  variant={isSelected ? 'primary' : isLocked ? 'tertiary' : 'secondary'}
                  size="small"
                  style={[
                    styles.tabText,
                    isSelected && styles.tabTextActive,
                    isLocked && styles.tabTextLocked,
                  ]}
                  fontFamily="regional_secondary"
                >
                  {i18n.t(`malaJapa.${mantra.key}`)}
                </ThemedLanguageText>
                {isLocked && (
                  <Ionicons
                    name="lock-closed"
                    size={14}
                    color={theme.icon.tertiary}
                    style={styles.lockIcon}
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    backgroundColor: 'rgba(255, 248, 225, 0.6)',
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  tabContainer: {
    flexDirection: 'row',
    gap: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.xs,
  },
  tab: {
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.lg,
    borderRadius: SIZES.radius.full,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  tabActive: {
    borderColor: '#FF8F00',
    shadowColor: '#FF8F00',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabInactive: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderColor: '#FFE0B2',
  },
  tabLocked: {
    opacity: 0.6,
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.spacing.xs,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabTextActive: {
    fontWeight: '700',
    fontSize: 14,
  },
  tabTextLocked: {
    opacity: 0.7,
  },
  lockIcon: {
    marginLeft: 2,
  },
});
