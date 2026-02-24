import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView } from 'react-native';

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
  const fonts = getLanguageFonts();

  const isMantraLocked = (mantraId: MantraType): boolean => {
    if (mantraId === 'hareKrishna') return false;
    return !isPro;
  };

  return (
    <Box className="w-full px-4 py-3 bg-primary-50/40 border-b border-primary-100/40">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}
      >
        {mantras.map((mantra) => {
          const isSelected = selectedMantra === mantra.id;
          const isLocked = isMantraLocked(mantra.id);
          return (
            <Pressable
              key={mantra.id}
              onPress={() => onMantraChange(mantra.id)}
              disabled={isLocked && !isSelected}
              className={`active:opacity-70 ${isLocked ? 'opacity-50' : ''}`}
            >
              <Box
                className={`px-4 py-2 rounded-full border items-center justify-center ${isSelected
                    ? 'bg-primary-100 border-primary-300'
                    : 'bg-white/70 border-primary-100/60'
                  }`}
              >
                <HStack className="items-center gap-1.5">
                  <Text
                    className={`text-[13px] ${isSelected
                        ? 'font-bold text-primary-900'
                        : 'font-medium text-neutral-600'
                      }`}
                    style={{ fontFamily: fonts.regional_secondary }}
                    numberOfLines={1}
                  >
                    {i18n.t(`malaJapa.${mantra.key}`)}
                  </Text>
                  {isLocked && (
                    <Ionicons
                      name="lock-closed"
                      size={12}
                      color={theme.icon.tertiary}
                    />
                  )}
                </HStack>
              </Box>
            </Pressable>
          );
        })}
      </ScrollView>
    </Box>
  );
};
