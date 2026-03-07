import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { ShareButton } from '@/features/chapterDetail/components';
import { createErrorAlert, createSuccessAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getSpeakerImage } from '@/lib/utils/speakerUtils';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';
import { AudioModal } from '../AudioModal';

type TranslationVerse = {
  id: string;
  verseNumber: string;
  speaker: string;
  speaker_english: string;
  translation: string;
};

interface TranslationMessageProps {
  verse: TranslationVerse;
  index: number;
  chapterId?: string;
  chapterNumber?: string;
}

export const TranslationMessage: React.FC<TranslationMessageProps> = ({
  verse,
  index,
  chapterId,
  chapterNumber,
}) => {
  const { showAlert, AlertComponent } = useCustomAlert();
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const messageCardRef = useRef<View | null>(null);
  const [hideShareButton, setHideShareButton] = useState(false);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);

  return (
    <Box className="mb-4">
      {AlertComponent}
      <View ref={messageCardRef} collapsable={false}>
        <Box
          className="rounded-[24px] p-5 shadow-sm border border-primary-900/10"
          style={{ backgroundColor: theme.background.primary }}
        >
          {/* Header row: Speaker info & actions */}
          <HStack className="items-center justify-between mb-4">
            <HStack className="items-center flex-1 pr-3">
              <Box className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-primary-100 shrink-0">
                <Image
                  source={getSpeakerImage(verse.speaker_english)}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                />
              </Box>
              <VStack className="flex-1 justify-center">
                <Text
                  className="text-[15px] font-black tracking-tight"
                  style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
                  numberOfLines={1}
                >
                  {verse.speaker}
                </Text>
                <Text
                  className="text-[13px] tracking-tight opacity-70"
                  style={{ fontFamily: fonts.regional_secondary, color: theme.text.secondary }}
                  numberOfLines={1}
                >
                  {i18n.t('verse.verse')} {verse.verseNumber}
                </Text>
              </VStack>
            </HStack>

            {/* Action Buttons */}
            {!hideShareButton && (
              <HStack className="items-center gap-2">
                {/* Audio Button */}
                <TouchableOpacity
                  onPress={() => setIsAudioModalVisible(true)}
                  className="w-10 h-10 rounded-full items-center justify-center shadow-sm"
                  style={{ backgroundColor: theme.background.secondary }}
                >
                  <MaterialIcons
                    name="volume-up"
                    size={20}
                    color={theme.icon.primary}
                  />
                </TouchableOpacity>

                {/* Share Button */}
                {chapterId && chapterNumber && (
                  <Box>
                    <ShareButton
                      verseId={verse.id}
                      chapterId={chapterId}
                      chapterNumber={chapterNumber}
                      verseNumber={verse.verseNumber}
                      verseText="" // Translation-only, no original verse text
                      translation={verse.translation}
                      speaker={verse.speaker}
                      onAlert={(title, message, type) => {
                        if (type === 'success') {
                          showAlert(createSuccessAlert(title, message));
                        } else if (type === 'error') {
                          showAlert(createErrorAlert(title, message));
                        } else {
                          showAlert({ title, message });
                        }
                      }}
                      verseViewRef={messageCardRef}
                      isTranslationOnly={true}
                      onCaptureStart={() => setHideShareButton(true)}
                      onCaptureEnd={() => setHideShareButton(false)}
                    />
                  </Box>
                )}
              </HStack>
            )}
          </HStack>

          {/* Translation Text */}
          <Box className="pl-0 sm:pl-[60px]">
            <Text
              className="text-[16px] leading-7"
              style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
            >
              {verse.translation}
            </Text>
          </Box>
        </Box>
      </View>

      {/* Audio Modal */}
      <AudioModal
        visible={isAudioModalVisible}
        onClose={() => setIsAudioModalVisible(false)}
        text={verse.translation}
        speaker={verse.speaker}
        speakerEnglish={verse.speaker_english}
        verseNumber={verse.verseNumber}
      />
    </Box>
  );
};
