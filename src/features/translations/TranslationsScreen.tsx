import { LoadingState } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { MangalacharanSectionCard } from '@/features/mangalacharan/components/MangalacharanSectionCard';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { useTranslationStore } from '@/store';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TranslationCard } from './components/TranslationCard';
import { useTranslationsOperations } from './hooks/useTranslationsOperations';

export const TranslationsScreen: React.FC = () => {
  const { translations, isLoading, loadAllTranslations } = useTranslationStore();
  const { handleTranslationPress } = useTranslationsOperations();
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadAllTranslations();
  }, [loadAllTranslations]);

  if (isLoading) {
    return <LoadingState message={i18n.t('translations.loading')} />;
  }

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {/* Custom Modern Header */}
      <Box
        className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
        style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
      >
        <HStack className="items-center justify-between">
          <TouchableOpacity
            className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70 border border-amber-100/50"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </TouchableOpacity>

          <Text
            className="text-[20px] font-black tracking-tight flex-1 text-center"
            style={{ fontWeight: 'bold', color: theme.text.primary }}
            numberOfLines={1}
          >
            {i18n.t('menu.translations')}
          </Text>

          <Box className="w-10 h-10 items-center justify-center">
            <MaterialIcons name="translate" size={24} color={theme.text.primary} />
          </Box>
        </HStack>
      </Box>

      <ScrollView
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Intro Section */}
        <Box
          className="rounded-[24px] border border-amber-100/50 shadow-sm overflow-hidden mb-6"
          style={{ backgroundColor: theme.background.primary }}
        >
          <MangalacharanSectionCard
            content={i18n.t('translations.intro')}
            variant="intro"
          />
        </Box>

        {/* Translations List */}
        <VStack className="mb-6">
          {translations.map((translation) => (
            <TranslationCard
              key={translation.chapter.id}
              translation={translation}
              onPress={handleTranslationPress}
            />
          ))}
        </VStack>

        {/* Motivational Message - Footer */}
        <Box
          className="rounded-[24px] border border-green-500/20 shadow-sm overflow-hidden mb-8 p-5"
          style={{ backgroundColor: theme.background.primary }}
        >
          <HStack className="items-center mb-3">
            <Box
              className="w-1.5 h-6 rounded-[2px] mr-3"
              style={{ backgroundColor: theme.status.success }}
            />
            <Text
              className="text-[18px] font-black tracking-tight flex-1"
              style={{ fontFamily: 'regional_secondary', color: theme.text.primary }}
            >
              {i18n.t('translations.motivationTitle')}
            </Text>
          </HStack>
          <Text
            className="text-[15px] leading-relaxed opacity-80"
            style={{ fontFamily: 'regional_secondary', color: theme.text.secondary }}
          >
            {i18n.t('translations.motivationText')}
          </Text>
        </Box>

      </ScrollView>
    </Box>
  );
};
