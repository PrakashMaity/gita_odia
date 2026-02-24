import { ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useSemanticColors } from '@/hooks/useSemanticColors';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';

interface DhyanaSectionCardProps {
  titleKey: string;
  content: string | string[];
  isList?: boolean;
  listType?: 'bullet' | 'numbered';
  variant?: 'intro' | 'default';
}

export const DhyanaSectionCard: React.FC<DhyanaSectionCardProps> = ({
  titleKey,
  content,
  isList = false,
  listType = 'bullet',
  variant = 'default',
}) => {
  const { colors } = useSemanticColors();
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
      if (textToSpeak) await speak(textToSpeak);
    }
  };

  const renderContent = () => {
    if (isList && Array.isArray(content)) {
      return (
        <VStack space="md" className="mt-3">
          {content.map((item: string, index: number) => (
            <HStack key={index} className="items-start">
              {listType === 'bullet' ? (
                <Box
                  className="w-2 h-2 rounded-full mt-2 mr-3 shrink-0"
                  style={{ backgroundColor: colors.primary600 }}
                />
              ) : (
                <Box
                  className="w-6 h-6 rounded-full items-center justify-center mr-3 mt-0.5 shrink-0"
                  style={{ backgroundColor: 'rgba(217,119,6,0.12)' }}
                >
                  <Text
                    className="text-[11px] font-bold"
                    style={{ color: colors.primary600 }}
                  >
                    {index + 1}
                  </Text>
                </Box>
              )}
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
        className={`text-[15px] leading-6 text-neutral-700 ${variant === 'intro' ? 'text-center' : ''}`}
        style={{ fontFamily: fonts.regional_secondary }}
      >
        {content as string}
      </Text>
    );
  };

  return (
    <Box
      className="rounded-[24px] p-5 mb-5 border border-primary-100/50 overflow-hidden"
      style={{ backgroundColor: theme.background.primary }}
    >
      {/* ─── Section Header ─── */}
      <HStack className="items-center mb-4">
        <Box
          className="w-1.5 h-7 rounded-full mr-3"
          style={{ backgroundColor: colors.primary600 }}
        />
        <Text
          className="text-[19px] font-black text-neutral-800 tracking-tight flex-1"
          style={{ fontFamily: fonts.regional_secondary }}
        >
          {i18n.t(titleKey)}
        </Text>
        <Pressable
          onPress={handleSpeak}
          className="w-10 h-10 rounded-full items-center justify-center border border-primary-100/50"
          style={{
            backgroundColor: isSpeaking
              ? theme.status.success
              : theme.background.secondary,
          }}
        >
          <MaterialIcons
            name="volume-up"
            size={20}
            color={isSpeaking ? '#fff' : theme.icon.primary}
          />
        </Pressable>
      </HStack>

      {/* ─── Content ─── */}
      {renderContent()}

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
