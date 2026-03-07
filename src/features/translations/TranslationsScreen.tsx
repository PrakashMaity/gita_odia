import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MangalacharanSectionCard } from '@/features/mangalacharan/components/MangalacharanSectionCard';
import i18n from '@/lib/i18n';
import { useTranslationStore } from '@/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TranslationCard, TranslationsLoadingSkeleton } from './components';
import { useTranslationsOperations } from './hooks/useTranslationsOperations';

export const TranslationsScreen: React.FC = () => {
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();
  const { handleTranslationPress } = useTranslationsOperations();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadAllTranslations();
  }, [loadAllTranslations]);

  if (isLoading) {
    return (
      <Box className="flex-1 bg-primary-50">
        {/* Custom Modern Header */}
        <Box
          className="pb-4 px-4 border-b border-primary-200 shadow-sm z-10 bg-white pt-4"
          style={{ paddingTop: Math.max(insets.top, 20) }}
        >
          <HStack className="items-center justify-between">
            <TouchableOpacity
              className="w-10 h-10 bg-white rounded-xl items-center justify-center active:opacity-70 border border-primary-200 shadow-sm"
              onPress={() => router.back()}
            >
              <Ionicons name="chevron-back" size={24} color="#0f172a" />
            </TouchableOpacity>

            <Text
              className="text-xl font-bold tracking-tight flex-1 text-center text-primary-950"
              numberOfLines={1}
            >
              {i18n.t('menu.translations')}
            </Text>

            <Box className="w-10 h-10 items-center justify-center">
              <MaterialIcons name="translate" size={24} color="#0f172a" />
            </Box>
          </HStack>
        </Box>
        <TranslationsLoadingSkeleton />
      </Box>
    );
  }

  return (
    <Box className="flex-1 bg-primary-50">
      {/* Custom Modern Header */}
      <Box
        className="pb-4 px-4 border-b border-primary-200 shadow-sm z-10 bg-white pt-4"
        style={{ paddingTop: Math.max(insets.top, 20) }}
      >
        <HStack className="items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 bg-white rounded-xl items-center justify-center active:opacity-70 border border-primary-200 shadow-sm"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color="#0f172a" />
          </TouchableOpacity>

          <Text
            className="text-xl font-bold tracking-tight flex-1 text-center text-primary-950"
            numberOfLines={1}
          >
            {i18n.t('menu.translations')}
          </Text>

          <Box className="w-10 h-10 items-center justify-center">
            <MaterialIcons name="translate" size={24} color="#0f172a" />
          </Box>
        </HStack>
      </Box>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerClassName="pb-16"
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Section */}
        <Box className="rounded-2xl border border-primary-200 shadow-sm overflow-hidden mb-6 bg-white">
          <MangalacharanSectionCard
            content={i18n.t('translations.intro')}
            variant="intro"
          />
        </Box>

        {/* Translations List */}
        <VStack className="mb-6 gap-4">
          {translations.map((translation) => (
            <TranslationCard
              key={translation.chapter.id}
              translation={translation}
              onPress={handleTranslationPress}
            />
          ))}
        </VStack>

        {/* Motivational Message - Footer */}
        <Box className="rounded-2xl border border-primary-200 shadow-sm overflow-hidden mb-8 p-6 bg-white">
          <HStack className="items-center mb-4">
            <Box className="w-1.5 h-6 rounded-sm mr-4 bg-primary-500" />
            <Text className="text-lg font-bold tracking-tight flex-1 text-primary-950 font-regional_secondary">
              {i18n.t('translations.motivationTitle')}
            </Text>
          </HStack>
          <Text className="text-base leading-6 opacity-80 text-primary-600 font-regional_secondary">
            {i18n.t('translations.motivationText')}
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
};
