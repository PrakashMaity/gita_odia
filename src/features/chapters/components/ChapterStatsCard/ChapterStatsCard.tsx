import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

interface ChapterStatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  iconColor?: string;
}

export const ChapterStatsCard: React.FC<ChapterStatsCardProps> = ({
  title,
  value,
  iconName,
  iconColor
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const iconColorValue = iconColor || theme.status.success;

  return (
    <Box
      className="flex-1 items-center justify-center min-h-[120px] py-4 rounded-[24px] border border-amber-100/50 shadow-sm overflow-hidden relative"
      style={{ backgroundColor: theme.background.primary }}
    >
      <Box className="absolute -right-4 -bottom-4 opacity-[0.03]" pointerEvents="none">
        <MaterialIcons name={iconName} size={80} color="#000" />
      </Box>

      <VStack className="items-center z-10 w-full px-2" space="sm">
        <Box
          className="w-12 h-12 rounded-full items-center justify-center mb-1"
          style={{ backgroundColor: iconColorValue + '20' }}
        >
          <MaterialIcons
            name={iconName}
            size={24}
            color={iconColorValue}
          />
        </Box>
        <Text
          className="text-[28px] font-bold text-neutral-800 tracking-tight"
          style={{ fontFamily: fonts.regional_secondary }}
          numberOfLines={1}
        >
          {value}
        </Text>
        <Text
          className="text-[12px] font-medium text-neutral-500 text-center leading-[16px]"
          style={{ fontFamily: fonts.regional_secondary }}
          numberOfLines={2}
        >
          {title}
        </Text>
      </VStack>
    </Box>
  );
};
