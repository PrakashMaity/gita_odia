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

interface SectionCardProps {
  titleKey?: string;
  content: string;
  variant?: 'intro' | 'default';
}

export const SectionCard: React.FC<SectionCardProps> = ({
  titleKey,
  content,
  variant = 'default',
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
      if (content) {
        await speak(content);
      }
    }
  };

  const isIntro = variant === 'intro';

  return (
    <Box
      className={`rounded-[24px] p-5 shadow-sm overflow-hidden mb-5 border ${isIntro ? 'border-primary-100/30' : 'border-primary-100/50'}`}
      style={{ backgroundColor: isIntro ? 'transparent' : theme.background.primary }}
    >
      {isIntro ? (
        <HStack className="items-start justify-between">
          <Box className="flex-1 pr-4">
            <Text
              className="text-[15px] font-medium text-neutral-700 leading-6"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {content}
            </Text>
          </Box>
          <Pressable
            onPress={handleSpeak}
            className="w-12 h-12 rounded-[16px] items-center justify-center border border-primary-100/50 shadow-sm shrink-0"
            style={{ backgroundColor: isSpeaking ? theme.status.success : theme.background.primary }}
          >
            <MaterialIcons
              name="volume-up"
              size={24}
              color={isSpeaking ? theme.text.primary : theme.icon.primary}
            />
          </Pressable>
        </HStack>
      ) : (
        <VStack>
          {titleKey && (
            <HStack className="items-center mb-4">
              <Box
                className="w-1.5 h-6 rounded-full mr-3"
                style={{ backgroundColor: theme.icon.primary }}
              />
              <Text
                className="text-[20px] font-black text-neutral-800 tracking-tight flex-1"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t(titleKey)}
              </Text>
              <Pressable
                onPress={handleSpeak}
                className="w-10 h-10 rounded-full items-center justify-center border border-primary-100/50 shadow-sm shrink-0"
                style={{ backgroundColor: isSpeaking ? theme.status.success : theme.background.secondary }}
              >
                <MaterialIcons
                  name="volume-up"
                  size={20}
                  color={isSpeaking ? theme.text.primary : theme.icon.primary}
                />
              </Pressable>
            </HStack>
          )}
          <Text
            className="text-[16px] leading-6 text-neutral-800"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {content}
          </Text>
        </VStack>
      )}

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
