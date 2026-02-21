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

interface MahatmyaSectionCardProps {
  titleKey?: string;
  content: string | string[];
  isList?: boolean;
  variant?: 'intro' | 'default';
  textStyle?: 'center' | 'left';
}

export const MahatmyaSectionCard: React.FC<MahatmyaSectionCardProps> = ({
  titleKey,
  content,
  isList = false,
  variant = 'default',
  textStyle = 'left',
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

  const getTextForTTS = (): string => {
    if (isList && Array.isArray(content)) {
      return content.join('. ');
    }
    return content as string;
  };

  const handleSpeak = async () => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    if (isSpeaking) {
      await stop();
    } else {
      const textToSpeak = getTextForTTS();
      if (textToSpeak) {
        await speak(textToSpeak);
      }
    }
  };

  const renderContent = () => {
    if (isList && Array.isArray(content)) {
      return (
        <VStack space="md" className="mt-3">
          {content.map((item: string, index: number) => (
            <HStack key={index} className="items-start">
              <Box
                className="w-2 h-2 rounded-full mt-2 mr-3"
                style={{ backgroundColor: theme.icon.primary }}
              />
              <Text
                className="flex-1 text-[15px] leading-6 text-neutral-700"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {item}
              </Text>
            </HStack>
          ))}
        </VStack>
      );
    }

    return (
      <Text
        className={`${variant === 'intro' ? 'text-[15px] font-medium text-neutral-700 leading-6' : 'text-[16px] leading-6 text-neutral-800'} ${textStyle === 'center' ? 'text-center' : ''}`}
        style={{ fontFamily: fonts.regional_secondary }}
      >
        {content as string}
      </Text>
    );
  };

  const isIntro = variant === 'intro';

  return (
    <Box
      className={`rounded-[24px] p-5 shadow-sm overflow-hidden mb-5 border ${isIntro ? 'border-amber-100/30' : 'border-amber-100/50'}`}
      style={{ backgroundColor: isIntro ? 'transparent' : theme.background.primary }}
    >
      {isIntro ? (
        <HStack className="items-start justify-between">
          <Box className="flex-1 pr-4">
            {renderContent()}
          </Box>
          <Pressable
            onPress={handleSpeak}
            className="w-12 h-12 rounded-[16px] items-center justify-center border border-amber-100/50 shadow-sm shrink-0"
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
                className="w-10 h-10 rounded-full items-center justify-center border border-amber-100/50 shadow-sm"
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
          {renderContent()}
        </VStack>
      )}

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
