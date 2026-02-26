import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import i18n from '@/lib/i18n';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { useVerseOfTheDayStore } from '@/store/verseOfTheDayStore';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Share, TouchableOpacity, View } from 'react-native';

export const VerseOfTheDayScreen: React.FC = () => {
  const { loadVerseOfTheDay, getTodaysVerse, shareVerse, isLoading } = useVerseOfTheDayStore();
  const verse = getTodaysVerse();
  const { speak, stop, isSpeaking } = useTextToSpeech({
    language: getBengaliTTSLanguage(),
    rate: 0.85,
    pitch: 1.0,
  });

  useEffect(() => {
    loadVerseOfTheDay();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShare = async () => {
    const shareText = shareVerse();
    if (shareText) {
      try {
        await Share.share({
          message: shareText,
          title: i18n.t('verseOfTheDay.shareTitle'),
        });
      } catch (error) {
        console.error('Error sharing verse:', error);
      }
    }
  };

  const handleViewChapter = () => {
    if (verse) {
      router.push(`/chapter/${verse.chapterId}`);
    }
  };

  const handleSpeakVerse = async () => {
    if (!verse) return;

    if (isSpeaking) {
      await stop();
    } else {
      try {
        const translation = verse.translation || '';
        const textToSpeak = `${verse.chapterNumber || ''} অধ্যায়, ${verse.verseNumber || ''} শ্লোক। ${translation}`;
        if (textToSpeak.trim()) {
          await speak(textToSpeak);
        }
      } catch (error) {
        console.error('Error speaking verse:', error);
      }
    }
  };

  if (isLoading || !verse) {
    return (
      <Box className="flex-1 bg-black">
        {/* Custom Modern Header */}
        <Box className="pb-4 px-4 border-b border-neutral-800 bg-black pt-12 shadow-sm z-10">
          <HStack className="items-center justify-between">
            <TouchableOpacity
              className="w-10 h-10 bg-neutral-900 rounded-xl items-center justify-center active:opacity-70 border border-neutral-800"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>

            <Text
              className="text-xl font-bold tracking-tight flex-1 text-center text-white"
              numberOfLines={1}
            >
              {i18n.t('verseOfTheDay.title')}
            </Text>

            <Box className="w-10 h-10" />
          </HStack>
        </Box>

        <View className="flex-1 justify-center items-center">
          <Text className="text-base text-neutral-400 font-regional_secondary">
            {i18n.t('common.loading')}
          </Text>
        </View>
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-black">
      {/* Custom Modern Header */}
      <Box className="pb-4 px-4 border-b border-neutral-800 bg-black pt-12 shadow-sm z-10">
        <HStack className="items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 bg-neutral-900 rounded-xl items-center justify-center active:opacity-70 border border-neutral-800"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>

          <Text
            className="text-xl font-bold tracking-tight flex-1 text-center text-white"
            numberOfLines={1}
          >
            {i18n.t('verseOfTheDay.title')}
          </Text>

          <Box className="w-10 h-10" />
        </HStack>
      </Box>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-16 pt-4 space-y-4"
        showsVerticalScrollIndicator={false}
      >
        <Box className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 mb-4">
          <Box className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-white font-regional_secondary">
              {i18n.t('verseOfTheDay.introTitle')}
            </Text>
            <TouchableOpacity
              onPress={async () => {
                if (isSpeaking) {
                  await stop();
                } else {
                  await speak(i18n.t('verseOfTheDay.introText'));
                }
              }}
              className={`w-10 h-10 rounded-full items-center justify-center ${isSpeaking ? 'bg-success-600' : 'bg-neutral-800'
                }`}
            >
              <MaterialIcons
                name="volume-up"
                size={20}
                color={isSpeaking ? 'white' : '#9ca3af'}
              />
            </TouchableOpacity>
          </Box>
          <Text className="text-base leading-6 text-neutral-300 font-regional_secondary">
            {i18n.t('verseOfTheDay.introText')}
          </Text>
        </Box>

        {/* Date Badge */}
        <Box className="self-center px-4 py-2 rounded-full bg-neutral-900 border border-neutral-800 mb-4">
          <Text className="text-sm font-bold text-white font-regional_secondary">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </Box>

        {/* Verse Card */}
        <Box className="p-6 rounded-3xl bg-neutral-900 border-2 border-white mb-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-lg font-bold text-white font-regional_secondary">
              {verse.chapterNumber} অধ্যায়, {verse.verseNumber} শ্লোক
            </Text>
            <TouchableOpacity
              onPress={handleSpeakVerse}
              className={`w-10 h-10 rounded-full items-center justify-center ${isSpeaking ? 'bg-success-600' : 'bg-neutral-800'
                }`}
            >
              <MaterialIcons
                name="volume-up"
                size={20}
                color={isSpeaking ? 'white' : '#9ca3af'}
              />
            </TouchableOpacity>
          </View>

          {verse.verseText && (
            <View className="mb-6">
              <Text className="text-2xl font-bold text-white leading-9 font-regional_primary text-center">
                {verse.verseText}
              </Text>
            </View>
          )}

          {verse.translation && (
            <View className="pt-4 border-t border-neutral-800">
              <Text className="text-base text-neutral-300 leading-6 font-regional_secondary">
                {verse.translation}
              </Text>
            </View>
          )}
        </Box>

        {/* Action Buttons */}
        <View className="flex-row gap-4 mb-4">
          <TouchableOpacity
            className="flex-1 py-4 bg-neutral-900 rounded-2xl flex-row justify-center items-center border border-neutral-800"
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={20} color="white" className="mr-2" />
            <Text className="text-sm font-bold text-white font-regional_secondary">
              {i18n.t('verseOfTheDay.share')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-1 py-4 bg-neutral-900 rounded-2xl flex-row justify-center items-center border border-neutral-800"
            onPress={handleViewChapter}
          >
            <Ionicons name="book-outline" size={20} color="white" className="mr-2" />
            <Text className="text-sm font-bold text-white font-regional_secondary">
              {i18n.t('verseOfTheDay.viewChapter')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Inspiration Message */}
        <Box className="p-5 rounded-3xl bg-neutral-900 border border-neutral-800 mb-4 items-center">
          <Text className="text-base leading-6 text-white text-center font-regional_secondary">
            {i18n.t('verseOfTheDay.inspirationMessage')}
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
};
