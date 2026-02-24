import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

interface SettingsItemProps {
  title: string;
  subtitle?: string;
  value?: string;
  icon?: string | React.ReactNode;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  disabled?: boolean;
}

export const SettingsItem: React.FC<SettingsItemProps> = ({
  title,
  subtitle,
  value,
  icon,
  onPress,
  rightElement,
  disabled = false,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  const content = (
    <HStack
      className={`items-center justify-between p-4 min-h-[80px] rounded-[20px] mb-2 border border-primary-900/5 ${disabled ? 'opacity-50' : ''}`}
      style={{ backgroundColor: theme.background.secondary }}
    >
      <HStack className="items-center flex-1">
        {icon && (
          <Box
            className="w-12 h-12 rounded-[16px] mr-4 items-center justify-center overflow-hidden border border-primary-100/50 shadow-sm"
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
        <VStack className="flex-1 justify-center">
          <Text
            className="text-[16px] font-bold tracking-normal mb-0.5"
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

      <HStack className="items-center shrink-0 ml-4">
        {value && (
          <Text
            className="text-[14px] font-medium mr-3"
            style={{ fontFamily: fonts.regional_secondary, color: theme.text.secondary }}
          >
            {value}
          </Text>
        )}
        {rightElement}
        {onPress && (
          <Box
            className="w-7 h-7 rounded-full items-center justify-center ml-2 border border-primary-100/50 shadow-sm"
            style={{ backgroundColor: theme.background.primary }}
          >
            <MaterialIcons
              name="arrow-forward-ios"
              size={12}
              color={theme.icon.secondary}
            />
          </Box>
        )}
      </HStack>
    </HStack>
  );

  if (onPress && !disabled) {
    return (
      <Pressable onPress={onPress} className="active:opacity-80">
        {content}
      </Pressable>
    );
  }

  return content;
};
