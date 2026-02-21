import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useCallback, useRef, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ProfileHeaderProps {
  onDeveloperButtonPress?: () => void;
  showDeveloperButton?: boolean;
  onDeveloperButtonClick?: () => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  onDeveloperButtonPress,
  showDeveloperButton = false,
  onDeveloperButtonClick,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const { isPro } = useProStatus();
  const insets = useSafeAreaInsets();

  const [tapCount, setTapCount] = useState(0);
  const tapTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const REQUIRED_TAPS = 10;

  const handleTitlePress = useCallback(() => {
    if (tapTimeoutRef.current) {
      clearTimeout(tapTimeoutRef.current);
    }

    tapTimeoutRef.current = setTimeout(() => {
      setTapCount(0);
    }, 2000);

    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    if (newTapCount >= REQUIRED_TAPS) {
      setTapCount(0);
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
      if (onDeveloperButtonPress) {
        onDeveloperButtonPress();
      }
    }
  }, [tapCount, onDeveloperButtonPress]);

  React.useEffect(() => {
    return () => {
      if (tapTimeoutRef.current) {
        clearTimeout(tapTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box
      className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
      style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
    >
      <HStack className="items-center justify-between min-h-[48px]">
        <Pressable
          onPress={handleTitlePress}
          className="flex-1 active:opacity-70"
        >
          <VStack>
            <HStack className="items-center space-x-2">
              <Text
                className="text-[28px] font-black tracking-tight text-neutral-800"
                style={{ fontFamily: fonts.primary_english }}
              >
                Settings
              </Text>
              {isPro && (
                <Box
                  className="px-2 py-0.5 rounded-full ml-2"
                  style={{ backgroundColor: theme.button.primary.background }}
                >
                  <Text
                    className="text-[10px] font-bold tracking-wider text-white"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    PRO
                  </Text>
                </Box>
              )}
            </HStack>
            <Text
              className="text-[13px] font-medium text-neutral-500 mt-0.5"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('profile.customizeExperience')}
            </Text>
          </VStack>
        </Pressable>

        {showDeveloperButton && (
          <Pressable
            onPress={onDeveloperButtonClick || onDeveloperButtonPress || (() => { })}
            className="px-3 py-2 rounded-xl flex-row items-center space-x-2 border shadow-sm active:opacity-70"
            style={{
              backgroundColor: theme.background.primary,
              borderColor: theme.border.primary
            }}
          >
            <MaterialIcons name="code" size={16} color={theme.icon.primary} />
            <Text
              className="text-[13px] font-medium ml-2"
              style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
            >
              Developer
            </Text>
          </Pressable>
        )}
      </HStack>
    </Box>
  );
};
