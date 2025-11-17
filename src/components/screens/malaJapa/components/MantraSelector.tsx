import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';

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
  const currentMantra = mantras.find(m => m.id === selectedMantra);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => {
        // Cycle through mantras
        const currentIndex = mantras.findIndex(m => m.id === selectedMantra);
        const nextIndex = (currentIndex + 1) % mantras.length;
        onMantraChange(mantras[nextIndex].id);
      }}
      activeOpacity={0.7}
    >
      <ThemedLanguageText
        variant="primary"
        size="medium"
        style={styles.buttonText}
        fontFamily="regional_secondary"
      >
        {i18n.t(`malaJapa.${currentMantra?.key}`)}
      </ThemedLanguageText>
      <Ionicons name="chevron-forward" size={SIZES.icon.md} color="#5D4037" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFF8E1',
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.lg,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: '#5D4037',
    fontWeight: '600',
  },
});
