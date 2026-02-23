import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useTheme';
import { getLanguageFonts } from '@/types/font.interface';
import React from 'react';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  children,
  description,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  return (
    <Box
      className="w-full mb-6 p-5 rounded-[24px] shadow-sm border border-amber-100/50"
      style={{ backgroundColor: theme.background.primary }}
    >
      <HStack className="items-center mb-2">
        <Box
          className="w-1.5 h-6 rounded-full mr-3"
          style={{ backgroundColor: theme.status.success + '60' }}
        />
        <Text
          className="text-[18px] font-bold tracking-tight flex-1"
          style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
        >
          {title}
        </Text>
      </HStack>

      {description && (
        <Text
          className="text-[15px] font-medium leading-6 mb-4 pl-[18px]"
          style={{ fontFamily: fonts.regional_secondary, color: theme.text.secondary }}
        >
          {description}
        </Text>
      )}

      <Box className="mt-1">
        {children}
      </Box>
    </Box>
  );
};
