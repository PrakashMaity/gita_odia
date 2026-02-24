import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface TimerControlsProps {
  timerState: 'idle' | 'running' | 'paused' | 'completed';
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onReset: () => void;
}

export const TimerControls: React.FC<TimerControlsProps> = ({
  timerState,
  onStart,
  onPause,
  onResume,
  onReset,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  return (
    <Box className="w-full mt-8">
      {timerState === 'idle' && (
        <Button
          size="lg"
          onPress={onStart}
          className="w-full h-16 rounded-[20px] bg-black border-0"
        >
          <ButtonIcon as={props => <Ionicons name="play" {...props} />} className="text-white mr-2" />
          <ButtonText
            className="text-white text-lg font-black tracking-tight"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {i18n.t('readingTimer.start')}
          </ButtonText>
        </Button>
      )}

      {timerState === 'running' && (
        <HStack space="md">
          <Button
            size="lg"
            onPress={onPause}
            className="flex-1 h-14 rounded-[20px] bg-primary-500 border-0"
          >
            <ButtonIcon as={props => <Ionicons name="pause" {...props} />} className="text-white mr-2" />
            <ButtonText
              className="text-white font-bold"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('readingTimer.pause')}
            </ButtonText>
          </Button>

          <Button
            size="lg"
            onPress={onReset}
            className="flex-1 h-14 rounded-[20px] bg-neutral-100 border-0"
          >
            <ButtonIcon as={props => <Ionicons name="stop" {...props} />} className="text-neutral-500 mr-2" />
            <ButtonText
              className="text-neutral-500 font-bold"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('readingTimer.reset')}
            </ButtonText>
          </Button>
        </HStack>
      )}

      {timerState === 'paused' && (
        <HStack space="md">
          <Button
            size="lg"
            onPress={onResume}
            className="flex-1 h-14 rounded-[20px] bg-success-600 border-0"
          >
            <ButtonIcon as={props => <Ionicons name="play" {...props} />} className="text-white mr-2" />
            <ButtonText
              className="text-white font-bold"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('readingTimer.resume')}
            </ButtonText>
          </Button>

          <Button
            size="lg"
            onPress={onReset}
            className="flex-1 h-14 rounded-[20px] bg-neutral-100 border-0"
          >
            <ButtonIcon as={props => <Ionicons name="stop" {...props} />} className="text-neutral-500 mr-2" />
            <ButtonText
              className="text-neutral-500 font-bold"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('readingTimer.reset')}
            </ButtonText>
          </Button>
        </HStack>
      )}

      {timerState === 'completed' && (
        <Button
          size="lg"
          onPress={onReset}
          className="w-full h-16 rounded-[20px] bg-black border-0"
        >
          <ButtonIcon as={props => <Ionicons name="refresh" {...props} />} className="text-white mr-2" />
          <ButtonText
            className="text-white text-lg font-black tracking-tight"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {i18n.t('readingTimer.restart')}
          </ButtonText>
        </Button>
      )}
    </Box>
  );
};
