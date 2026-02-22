import { LockedCardOverlay, ProUpgradeModal } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { useDailyReadingStore } from '@/store/dailyReadingStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { QuickActionButtons } from './components/QuickActionButtons';
import { StatsCard } from './components/StatsCard';
import { StreakCard } from './components/StreakCard';
import { WeeklyChart } from './components/WeeklyChart';

export const DailyReadingScreen: React.FC = () => {
  const {
    loadDailyReading,
    currentStreak,
    longestStreak,
    totalReadingDays,
    totalVersesRead,
    getTodayRecord,
    getWeeklyStats,
  } = useDailyReadingStore();

  const [todayRecord, setTodayRecord] = useState(getTodayRecord());

  useEffect(() => {
    loadDailyReading();
  }, []);

  useEffect(() => {
    setTodayRecord(getTodayRecord());
  }, [currentStreak, totalVersesRead]);

  const weeklyStats = getWeeklyStats();
  const todayVerses = todayRecord?.versesRead || 0;
  const { isPro } = useProStatus();
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();
  const [showProModal, setShowProModal] = useState(false);

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      <Box
        className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
        style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
      >
        <HStack className="items-center justify-between">
          <Pressable
            className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={22} color={theme.text.primary} />
          </Pressable>

          <Text
            className="flex-1 text-center text-xl font-bold"
            style={{ color: theme.text.primary }}
            numberOfLines={1}
          >
            {i18n.t('dailyReading.title')}
          </Text>

          <Box className="w-10 h-10" />
        </HStack>
      </Box>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <VStack className="px-4 pt-4 pb-12" space="md">
          <ThemedCard variant="card">
            <ThemedLanguageText
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
            >
              {i18n.t('dailyReading.subtitle')}
            </ThemedLanguageText>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
            >
              {i18n.t('dailyReading.todayVerses')}: {todayVerses}
            </ThemedLanguageText>
          </ThemedCard>

          <QuickActionButtons />

          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />

          <VStack className="mt-2" space="sm">
            <HStack className="items-center">
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
              >
                {i18n.t('dailyReading.statsTitle')}
              </ThemedLanguageText>
            </HStack>

            <HStack className="gap-4">
              <StatsCard
                title={i18n.t('dailyReading.todayVerses')}
                value={todayVerses.toString()}
                iconName="book-outline"
              />
              <StatsCard
                title={i18n.t('dailyReading.totalDays')}
                value={totalReadingDays.toString()}
                iconName="calendar-outline"
              />
            </HStack>

            <HStack className="gap-4">
              <Box className="flex-1">
                <LockedCardOverlay
                  isLocked={!isPro}
                  onPress={() => setShowProModal(true)}
                >
                  <StatsCard
                    title={i18n.t('dailyReading.totalVerses')}
                    value={totalVersesRead.toString()}
                    iconName="library-outline"
                  />
                </LockedCardOverlay>
              </Box>
              <Box className="flex-1">
                <LockedCardOverlay
                  isLocked={!isPro}
                  onPress={() => setShowProModal(true)}
                >
                  <StatsCard
                    title={i18n.t('dailyReading.longestStreak')}
                    value={longestStreak.toString()}
                    iconName="flame-outline"
                  />
                </LockedCardOverlay>
              </Box>
            </HStack>
          </VStack>

          {weeklyStats.length > 0 && (
            <LockedCardOverlay
              isLocked={!isPro}
              onPress={() => setShowProModal(true)}
            >
              <WeeklyChart data={weeklyStats} />
            </LockedCardOverlay>
          )}

          <ThemedCard variant="card">
            <HStack className="items-center mb-4">
              <ThemedLanguageText
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
              >
                {i18n.t('dailyReading.motivationTitle')}
              </ThemedLanguageText>
            </HStack>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
            >
              {currentStreak > 0
                ? i18n.t('dailyReading.streakMessage', { count: currentStreak })
                : i18n.t('dailyReading.startMessage')}
            </ThemedLanguageText>
          </ThemedCard>

        </VStack>
      </ScrollView>

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
