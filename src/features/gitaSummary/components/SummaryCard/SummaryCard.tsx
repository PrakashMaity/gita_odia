import { ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useThemeColors } from '@/hooks/useTheme';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

interface SummaryCardProps {
  chapter: string;
  title: string;
  summary: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  chapter,
  title,
  summary,
}) => {
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);
  const { speak, stop, isSpeaking } = useTextToSpeech({
    language: getBengaliTTSLanguage(),
    rate: 0.85,
    pitch: 1.0,
    onError: (error) => {
      if (error.message === 'PRO_REQUIRED') {
        setShowProModal(true);
      }
    },
  });

  const handleSpeak = async () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    if (isSpeaking) {
      await stop();
    } else {
      const textToSpeak = `${title}. ${summary}`;
      await speak(textToSpeak);
    }
  };

  return (
    <Box
      className="bg-white rounded-[24px] p-5 shadow-sm overflow-hidden mb-4 border border-primary-100/50"
      style={{ backgroundColor: theme.background.primary }}
    >
      <VStack>
        <HStack className="items-center mb-3">
          <Box
            className="px-3 py-1 rounded-full mr-3 border border-primary-100/80 shadow-sm"
            style={{ backgroundColor: theme.background.secondary }}
          >
            <Text
              className="text-[12px] font-bold text-primary-700"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {chapter}
            </Text>
          </Box>
          <Text
            className="text-[18px] font-black tracking-tight text-neutral-800 flex-1"
            style={{ fontFamily: fonts.regional_secondary }}
            numberOfLines={1}
          >
            {title}
          </Text>
          <Pressable
            onPress={handleSpeak}
            className="w-10 h-10 rounded-full items-center justify-center border border-primary-100/50 shadow-sm shrink-0 ml-2"
            style={{ backgroundColor: isSpeaking ? theme.status.success : theme.background.secondary }}
          >
            <MaterialIcons
              name="volume-up"
              size={20}
              color={isSpeaking ? theme.text.primary : theme.icon.primary}
            />
          </Pressable>
        </HStack>

        <Text
          className="text-[15px] leading-6 text-neutral-700"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {summary}
        </Text>
      </VStack>

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
