import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import React from 'react';

type SoundType = 'none' | 'bell' | 'chime' | 'om';

interface SoundSelectorProps {
  selectedSound: SoundType;
  onSoundChange: (sound: SoundType) => void;
}

const SOUNDS: { value: SoundType; labelKey: string; icon: string }[] = [
  { value: 'none', labelKey: 'readingTimer.sounds.none', icon: '🔇' },
  { value: 'bell', labelKey: 'readingTimer.sounds.bell', icon: '🔔' },
  { value: 'chime', labelKey: 'readingTimer.sounds.chime', icon: '🎵' },
  { value: 'om', labelKey: 'readingTimer.sounds.om', icon: 'ॐ' },
];

export const SoundSelector: React.FC<SoundSelectorProps> = ({
  selectedSound,
  onSoundChange,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  return (
    <Box
      className="w-full mt-8 p-6 rounded-[28px] border border-primary-100 shadow-sm"
      style={{ backgroundColor: theme.background.primary }}
    >
      <Text
        className="text-[16px] font-extrabold text-primary-950 mb-6 text-center tracking-tight"
        style={{ fontFamily: fonts.regional_secondary }}
      >
        {i18n.t('readingTimer.completionSound')}
      </Text>
      <HStack space="sm" className="justify-center">
        {SOUNDS.map((sound) => {
          const isActive = selectedSound === sound.value;
          return (
            <Pressable
              key={sound.value}
              onPress={() => onSoundChange(sound.value)}
              className={`flex-1 min-w-[70px] items-center p-4 rounded-[20px] border ${isActive ? 'border-primary-400 bg-primary-50' : 'border-primary-100 bg-white'
                }`}
            >
              <Text className="text-2xl mb-2">
                {sound.icon}
              </Text>
              <Text
                className={`text-[11px] text-center font-bold ${isActive ? 'text-primary-800' : 'text-primary-500'
                  }`}
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t(sound.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </HStack>
    </Box>
  );
};
