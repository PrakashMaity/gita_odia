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

interface MangalacharanSectionCardProps {
  titleKey?: string;
  content: string | string[];
  isList?: boolean;
  variant?: 'intro' | 'default';
  textStyle?: 'center' | 'left';
  isBreakdown?: boolean;
  breakdownData?: any;
}

export const MangalacharanSectionCard: React.FC<MangalacharanSectionCardProps> = ({
  titleKey,
  content,
  isList = false,
  variant = 'default',
  textStyle = 'left',
  isBreakdown = false,
  breakdownData,
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
    if (isBreakdown && breakdownData) {
      return Object.keys(breakdownData)
        .map((key) => {
          const section = breakdownData[key];
          return `${section.title}. ${section.mantra}. ${section.meaning}`;
        })
        .join(' ');
    }
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

  const handleBreakdownSectionSpeak = async (section: any) => {
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    const textToSpeak = `${section.title}. ${section.mantra}. ${section.meaning}`;
    if (isSpeaking) {
      await stop();
    } else {
      await speak(textToSpeak);
    }
  };

  const renderContent = () => {
    if (isBreakdown && breakdownData) {
      return (
        <VStack space="xl" className="mt-4">
          {Object.keys(breakdownData).map((key, index) => {
            const section = breakdownData[key];
            const sectionIsSpeaking = isSpeaking;
            return (
              <Box key={key} className={`bg-white/40 p-4 rounded-[20px] shadow-sm border border-primary-900/5 ${index > 0 ? 'mt-2' : ''}`}>
                <HStack className="items-center justify-between mb-3">
                  <Text
                    className="text-[18px] font-black text-primary-900 flex-1"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {section.title}
                  </Text>
                  <Pressable
                    onPress={() => handleBreakdownSectionSpeak(section)}
                    className="w-10 h-10 rounded-full items-center justify-center border border-primary-100/50 shadow-sm"
                    style={{ backgroundColor: sectionIsSpeaking ? theme.status.success : theme.background.secondary }}
                  >
                    <MaterialIcons
                      name="volume-up"
                      size={20}
                      color={sectionIsSpeaking ? theme.text.primary : theme.icon.primary}
                    />
                  </Pressable>
                </HStack>
                <Text
                  className="text-[16px] text-neutral-800 leading-6 mb-3 font-semibold"
                  style={{ fontFamily: fonts.regional_primary }}
                >
                  {section.mantra}
                </Text>
                <Text
                  className="text-[14px] text-neutral-600 leading-5"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {section.meaning}
                </Text>
              </Box>
            );
          })}
        </VStack>
      );
    }

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
      className={`rounded-[24px] p-5 shadow-sm overflow-hidden mb-5 border ${isIntro ? 'border-primary-100/30' : 'border-primary-100/50'}`}
      style={{ backgroundColor: isIntro ? 'transparent' : theme.background.primary }}
    >
      {isIntro ? (
        <HStack className="items-start justify-between">
          <Box className="flex-1 pr-4">
            {renderContent()}
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
                className="w-10 h-10 rounded-full items-center justify-center border border-primary-100/50 shadow-sm"
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
