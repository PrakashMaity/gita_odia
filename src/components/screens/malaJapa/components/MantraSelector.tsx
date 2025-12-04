import React from 'react';
import { TouchableOpacity, StyleSheet, View, ScrollView } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import { useThemeColors } from '@/hooks/useTheme';

type MantraType = 'hareKrishna' | 'omNamah' | 'gitaDhyana' | 'custom';

interface MantraSelectorProps {
  selectedMantra: MantraType;
  onMantraChange: (mantra: MantraType) => void;
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
}) => {
  const theme = useThemeColors();

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {mantras.map((mantra) => {
          const isSelected = selectedMantra === mantra.id;
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
              ]}
              onPress={() => onMantraChange(mantra.id)}
              activeOpacity={0.7}
            >
              <ThemedLanguageText
                variant={isSelected ? 'primary' : 'secondary'}
                size="small"
                style={[
                  styles.tabText,
                  isSelected && styles.tabTextActive,
                ]}
                fontFamily="regional_secondary"
              >
                {i18n.t(`malaJapa.${mantra.key}`)}
              </ThemedLanguageText>
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
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  tabTextActive: {
    fontWeight: '700',
    fontSize: 14,
  },
});
