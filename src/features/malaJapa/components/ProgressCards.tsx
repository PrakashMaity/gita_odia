import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import React from 'react';

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
  const fonts = getLanguageFonts();
  const theme = useThemeColors();

  return (
    <HStack className="w-full px-4 gap-3 mt-4">
      {/* Current Japa Card */}
      <Box
        className="flex-1 rounded-[22px] p-5 border border-primary-100/60 items-center justify-center shadow-sm"
        style={{ backgroundColor: theme.background.secondary, minHeight: 100 }}
      >
        <Text
          className="text-[30px] font-black text-[#5D4037] mb-1 text-center tracking-tight"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {currentCount} / {beadCount}
        </Text>
        <Text
          className="text-[13px] font-semibold text-[#8D6E63] text-center"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {i18n.t('malaJapa.currentJapa')}
        </Text>
      </Box>

      {/* Completed Malas Card */}
      <Box
        className="flex-1 rounded-[22px] p-5 border border-primary-100/60 items-center justify-center shadow-sm"
        style={{ backgroundColor: theme.background.secondary, minHeight: 100 }}
      >
        <Text
          className="text-[30px] font-black text-[#5D4037] mb-1 text-center tracking-tight"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {completedMalas}
        </Text>
        <Text
          className="text-[13px] font-semibold text-[#8D6E63] text-center"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {i18n.t('malaJapa.completedMalas')}
        </Text>
      </Box>
    </HStack>
  );
};
