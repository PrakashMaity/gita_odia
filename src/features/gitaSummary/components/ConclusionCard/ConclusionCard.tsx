import { ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

interface ConclusionCardProps {
  titleKey: string;
  teachings: string[];
}

export const ConclusionCard: React.FC<ConclusionCardProps> = ({
  titleKey,
  teachings,
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
      const textToSpeak = `${i18n.t(titleKey)}. ${teachings.join('. ')}`;
      await speak(textToSpeak);
    }
  };

  return (
    <Box
      className="bg-white rounded-[24px] p-5 shadow-sm overflow-hidden mb-6 border border-amber-100/50"
      style={{ backgroundColor: theme.background.primary }}
    >
      <VStack>
        <HStack className="items-center mb-5">
          <Box
            className="w-1.5 h-6 rounded-full mr-3"
            style={{ backgroundColor: theme.icon.primary }}
          />
          <Text
            className="text-[20px] font-black tracking-tight text-neutral-800 flex-1"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {i18n.t(titleKey)}
          </Text>
          <Pressable
            onPress={handleSpeak}
            className="w-10 h-10 rounded-full items-center justify-center border border-amber-100/50 shadow-sm shrink-0"
            style={{ backgroundColor: isSpeaking ? theme.status.success : theme.background.secondary }}
          >
            <MaterialIcons
              name="volume-up"
              size={20}
              color={isSpeaking ? theme.text.primary : theme.icon.primary}
            />
          </Pressable>
        </HStack>

        <VStack space="md">
          {teachings.map((teaching: string, index: number) => (
            <HStack key={index} className="items-start">
              <Box
                className="w-2 h-2 rounded-full mt-2 mr-3"
                style={{ backgroundColor: theme.icon.primary }}
              />
              <Text
                className="flex-1 text-[15px] leading-6 text-neutral-700"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {teaching}
              </Text>
            </HStack>
          ))}
        </VStack>
      </VStack>

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
