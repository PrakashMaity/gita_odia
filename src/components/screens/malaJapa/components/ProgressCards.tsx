import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';

interface ProgressCardsProps {
  currentJapa: number;
  completedMalas: number;
  beadCount: 27 | 54 | 108;
}

export const ProgressCards: React.FC<ProgressCardsProps> = ({
  currentJapa,
  completedMalas,
  beadCount,
}) => {
  const currentCount = currentJapa % beadCount;

  return (
    <View style={styles.container}>
      <View style={styles.cardsRow}>
        {/* Left Card - Current Japa */}
        <View style={styles.card}>
          <ThemedLanguageText
            variant="primary"
            size="xxxl"
            style={styles.countText}
            fontFamily="regional_secondary"
          >
            {currentCount} / {beadCount}
          </ThemedLanguageText>
          <ThemedLanguageText
            variant="secondary"
            size="sm"
            style={styles.labelText}
            fontFamily="regional_secondary"
          >
            {i18n.t('malaJapa.currentJapa')}
          </ThemedLanguageText>
        </View>

        {/* Right Card - Completed Malas */}
        <View style={styles.card}>
          <ThemedLanguageText
            variant="primary"
            size="xxxl"
            style={styles.countText}
            fontFamily="regional_secondary"
          >
            {completedMalas} {i18n.t('malaJapa.completedMalas')}
          </ThemedLanguageText>
          <ThemedLanguageText
            variant="secondary"
            size="sm"
            style={styles.labelText}
            fontFamily="regional_secondary"
          >
            {i18n.t('malaJapa.completedMalas')}
          </ThemedLanguageText>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: SIZES.spacing.lg,
  },
  cardsRow: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  countText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#5D4037',
    marginBottom: SIZES.spacing.xs,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 14,
    color: '#5D4037',
    fontWeight: '500',
    textAlign: 'center',
  },
});
