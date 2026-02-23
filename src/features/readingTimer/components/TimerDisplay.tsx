import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useThemeColors } from '@/hooks/useTheme';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';

interface TimerDisplayProps {
  timeLeft: number;
  timerState: 'idle' | 'running' | 'paused' | 'completed';
  formatTime: (seconds: number) => string;
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeLeft,
  timerState,
  formatTime,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();

  const getDisplayColor = () => {
    switch (timerState) {
      case 'running':
        return '#d97706'; // amber-600
      case 'paused':
        return '#f59e0b'; // amber-500
      case 'completed':
        return '#10b981'; // emerald-500
      default:
        return '#D1D5DB'; // gray-300
    }
  };

  const statusLabel = () => {
    switch (timerState) {
      case 'running': return 'চলছে...';
      case 'paused': return 'বিরতি';
      case 'completed': return 'সম্পন্ন';
      default: return 'প্রস্তুত';
    }
  };

  return (
    <Box className="w-full items-center justify-center mt-6 mb-4">
      <Box
        className="w-[280px] h-[280px] rounded-full items-center justify-center relative shadow-xl"
        style={{
          backgroundColor: theme.background.primary,
          borderWidth: 2,
          borderColor: getDisplayColor() + '40'
        }}
      >
        {/* Background Decorative Icon */}
        <Box className="absolute opacity-[0.03]" pointerEvents="none">
          <FontAwesome5 name="clock" size={160} color="#000" />
        </Box>

        {/* Inner Progress Border (Subtle) */}
        <Box
          className="absolute inset-4 rounded-full border-[8px]"
          style={{
            borderColor: getDisplayColor() + '15'
          }}
        />

        <VStack className="items-center justify-center z-10" space="xs">
          <Text
            className="text-[64px] font-black tracking-tighter"
            style={{
              fontFamily: fonts.regional_secondary,
              color: timerState === 'idle' ? theme.text.secondary : getDisplayColor(),
              lineHeight: 80
            }}
          >
            {formatTime(timeLeft)}
          </Text>

          <Box className={`px-4 py-1 rounded-full ${timerState === 'running' ? 'bg-amber-50' : 'bg-neutral-50'}`}>
            <Text
              className={`text-[14px] font-bold uppercase tracking-widest ${timerState === 'running' ? 'text-amber-800' : 'text-neutral-500'
                }`}
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {statusLabel()}
            </Text>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};
