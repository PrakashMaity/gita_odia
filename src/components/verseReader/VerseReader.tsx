import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { Box } from '@/components/ui/box';
import { ShareButton } from '@/features/chapterDetail/components';
import { FavoriteButton } from '@/features/favorites/components';
import { AudioModal } from '@/features/translationDetail/components/AudioModal';
import { useThemeColors } from '@/hooks/useTheme';
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
  const theme = useThemeColors();
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
          {/* Header Row: Speaker + Verse Number + Actions */}
          <View
            className="flex-row items-center justify-between mb-8 pb-4"
            style={{ borderBottomWidth: 1, borderBottomColor: theme.border.primary + '30' }}
          >
            {/* Left: Speaker Info */}
            <View className="flex-row items-center" style={{ gap: 12 }}>
              <View
                className="p-1 rounded-full"
                style={{ backgroundColor: theme.background.quaternary }}
              >
                <Image
                  source={getSpeakerImage(verse.speaker_english)}
                  className="w-12 h-12 rounded-full"
                  style={{ borderWidth: 2, borderColor: theme.border.primary + '50' }}
                />
              </View>
              <View>
                <AppText
                  variant="caption"
                  className="uppercase tracking-wider mb-0.5"
                  style={{ color: theme.text.secondary }}
                >
                  Speaker
                </AppText>
                <AppText
                  variant="card-title"
                  style={{ color: theme.text.primary }}
                >
                  {verse.speaker}
                </AppText>
              </View>
            </View>

            {/* Right: Verse Number & Actions */}
            <View className="items-end">
              <AppText
                variant="caption"
                className="uppercase tracking-wider mb-0.5"
                style={{ color: theme.text.secondary }}
              >
                {i18n.t('verse.verse')}
              </AppText>
              <AppHeading
                variant="card"
                className="mb-2"
                style={{ color: theme.text.primary }}
              >
                {verse.verseNumber}
              </AppHeading>

              {chapterId && chapterNumber && (
                <View className="flex-row items-center" style={{ gap: 10 }}>
                  {/* Audio Button */}
                  <TouchableOpacity
                    onPress={() => setIsAudioModalVisible(true)}
                    className="w-9 h-9 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: theme.background.quaternary,
                      borderWidth: 1,
                      borderColor: theme.border.primary + '40',
                    }}
                  >
                    <MaterialIcons
                      name="volume-up"
                      size={18}
                      color={theme.icon.primary}
                    />
                  </TouchableOpacity>

                  <FavoriteButton
                    verseId={verse.id}
                    chapterId={chapterId}
                    chapterNumber={chapterNumber}
                    verseNumber={verse.verseNumber}
                    verseText={verse.Language}
                    onAlert={onAlert}
                  />

                  {!hideShareButton && (
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
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Verse Text (Original Language) */}
          {showLanguage && (
            <View className="mb-8">
              <AppText
                variant="page-title"
                className="text-center font-bold"
                style={{ color: theme.text.primary, fontSize: 26, lineHeight: 42 }}
              >
                {verse.Language}
              </AppText>
            </View>
          )}

          {/* Translation */}
          {showTranslation && (
            <View className="mb-4">
              <View
                className="mb-4 pb-2"
                style={{ borderBottomWidth: 1, borderBottomColor: theme.border.primary + '30' }}
              >
                <AppText
                  variant="card-title"
                  className="text-center"
                  style={{ color: theme.text.secondary }}
                >
                  {i18n.t('verse.translation')}
                </AppText>
              </View>
              <AppText
                variant="body"
                className="text-center"
                style={{ color: theme.text.primary, fontSize: 18, lineHeight: 30 }}
              >
                {verse.translation}
              </AppText>
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
