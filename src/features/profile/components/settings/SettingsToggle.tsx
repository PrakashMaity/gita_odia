import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import { getLanguageFonts } from '@/types/font.interface';
import React from 'react';
import { Switch } from 'react-native';

interface SettingsToggleProps {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  icon?: string | React.ReactNode;
  disabled?: boolean;
}

export const SettingsToggle: React.FC<SettingsToggleProps> = ({
  title,
  subtitle,
  value,
  onValueChange,
  icon,
  disabled = false,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  return (
    <HStack
      className={`items-center justify-between p-4 min-h-[80px] rounded-[20px] mb-2 border border-amber-900/5 ${disabled ? 'opacity-50' : ''}`}
      style={{ backgroundColor: theme.background.secondary }}
    >
      <HStack className="items-center flex-1">
        {icon && (
          <Box
            className="w-12 h-12 rounded-[16px] mr-4 items-center justify-center overflow-hidden border border-amber-100/50 shadow-sm"
            style={{ backgroundColor: theme.background.primary }}
          >
            {typeof icon === 'string' ? (
              <Text style={{ color: theme.icon.primary, fontSize: 24, textAlign: 'center' }}>
                {icon}
              </Text>
            ) : (
              icon
            )}
          </Box>
        )}
        <VStack className="flex-1 justify-center mr-4">
          <Text
            className="text-[16px] font-black tracking-tight mb-1"
            style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-[13px] font-medium leading-[18px]"
              style={{ fontFamily: fonts.regional_secondary, color: theme.text.secondary }}
            >
              {subtitle}
            </Text>
          )}
        </VStack>
      </HStack>

      <Box className="shrink-0 ml-2">
        <Switch
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          trackColor={{
            false: theme.background.card,
            true: theme.status.success,
          }}
          thumbColor={theme.background.primary}
          ios_backgroundColor={theme.background.card}
        />
      </Box>
    </HStack>
  );
};
