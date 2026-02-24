import { useSemanticColors } from '@/hooks/useSemanticColors';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { ShareButton } from '@/features/chapterDetail/components';
import { FavoriteButton } from '@/features/favorites/components';
import { AudioModal } from '@/features/translationDetail/components/AudioModal';
import i18n from '@/lib/i18n';
import { getSpeakerImage } from '@/lib/utils/speakerUtils';
import { MaterialIcons } from '@expo/vector-icons';
import React, { useMemo, useRef, useState } from 'react';
import { Image, TouchableOpacity, View } from 'react-native';

interface Verse {
  verseNumber: string;
  Language: string;
  translation: string;
  speaker: string;
  speaker_english: string;
  id: string;
}

interface VerseReaderProps {
  verse: Verse;
  showLanguage: boolean;
  showTranslation: boolean;
  onToggleLanguage: () => void;
  onToggleTranslation: () => void;
  chapterId?: string;
  chapterNumber?: string;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
}

export default function VerseReader({
  verse,
  showLanguage,
  showTranslation,
  onToggleLanguage,
  onToggleTranslation,
  chapterId,
  chapterNumber,
  onAlert,
}: VerseReaderProps) {
  const { colors } = useSemanticColors();
  const verseCardRef = useRef<View | null>(null);
  const [hideShareButton, setHideShareButton] = useState(false);
  const [isAudioModalVisible, setIsAudioModalVisible] = useState(false);

  // Prepare verse data for audio with proper structure
  const audioVerse = useMemo(() => {
    return {
      Language: showLanguage ? verse.Language : undefined,
      translation: showTranslation ? verse.translation : undefined,
      speakerEnglish: verse.speaker_english,
    };
  }, [showLanguage, showTranslation, verse.Language, verse.translation, verse.speaker_english]);

  return (
    <View className="flex-1">
      {/* Verse Display */}
      <View ref={verseCardRef} collapsable={false}>
        <Box className="mb-6 px-4 py-8 rounded-2xl">
          <View className="flex-row items-center justify-between mb-6">

            <View className="flex-col items-center">
              <View className="items-center justify-center">
                <Image
                  source={getSpeakerImage(verse.speaker_english)}
                  className="w-20 h-20 rounded-full border-[3px] border-primary-500"
                />
              </View>
              <Text className="ml-2 text-[15px] mt-2 font-regional_secondary font-bold text-secondary-600 dark:text-secondary-400">
                {verse.speaker}
              </Text>
            </View>

            <View className="justify-center items-center">
              <Text className="text-xl font-bold font-regional_secondary text-secondary-900 dark:text-secondary-100">
                {i18n.t('verse.verse')} - {verse.verseNumber}
              </Text>
            </View>

            {/* Action Buttons Container */}
            {chapterId && chapterNumber && (
              <View className="flex-row items-center justify-center gap-4 mt-2">
                {/* Audio Button */}
                <TouchableOpacity
                  onPress={() => setIsAudioModalVisible(true)}
                  className="w-10 h-10 rounded-full items-center justify-center border border-primary-200 dark:border-primary-800 bg-secondary-50 dark:bg-secondary-900"
                >
                  <MaterialIcons
                    name="volume-up"
                    size={24}
                    color={colors.primary600}
                  />
                </TouchableOpacity>

                <View>
                  <FavoriteButton
                    verseId={verse.id}
                    chapterId={chapterId}
                    chapterNumber={chapterNumber}
                    verseNumber={verse.verseNumber}
                    verseText={verse.Language}
                    onAlert={onAlert}
                  />
                </View>
                {!hideShareButton && (
                  <View>
                    <ShareButton
                      verseId={verse.id}
                      chapterId={chapterId}
                      chapterNumber={chapterNumber}
                      verseNumber={verse.verseNumber}
                      verseText={verse.Language}
                      translation={verse.translation}
                      speaker={verse.speaker}
                      onAlert={onAlert}
                      verseViewRef={verseCardRef}
                      onCaptureStart={() => setHideShareButton(true)}
                      onCaptureEnd={() => setHideShareButton(false)}
                    />
                  </View>
                )}
              </View>
            )}
          </View>

          {showLanguage && (
            <View className="mb-6">
              <View className="items-center">
                <Text
                  className="text-center mb-6 text-3xl font-regional_secondary self-center leading-10 font-bold text-secondary-900 dark:text-secondary-100"
                >
                  {verse.Language}
                </Text>
              </View>
            </View>
          )}

          {showTranslation && (
            <View className="mb-6">
              <View className="mb-4">
                <Text className="text-center text-[18px] font-bold font-regional_secondary text-secondary-600 dark:text-secondary-400">
                  {i18n.t('verse.translation')}
                </Text>
              </View>
              <Text
                className="text-center text-xl leading-8 mt-2 font-regional_secondary text-secondary-900 dark:text-secondary-100"
              >
                {verse.translation}
              </Text>
            </View>
          )}
        </Box>
      </View>

      {/* Audio Modal */}
      <AudioModal
        visible={isAudioModalVisible}
        onClose={() => setIsAudioModalVisible(false)}
        verses={audioVerse.Language || audioVerse.translation ? [audioVerse] : undefined}
        speaker={verse.speaker}
        speakerEnglish={verse.speaker_english}
        verseNumber={verse.verseNumber}
        chapterNumber={chapterNumber}
      />
    </View>
  );
}
