import React, { useEffect, useState } from 'react';
import { View, ScrollView, ImageBackground } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { PageHeader } from '@/components/shared';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import { useDailyReadingStore } from '@/store/dailyReadingStore';
import { StatsCard } from './components/StatsCard';
import { StreakCard } from './components/StreakCard';
import { WeeklyChart } from './components/WeeklyChart';
import { LayoutImages } from '@/utils/assets';
import { styles } from './DailyReadingScreen.styles';

export const DailyReadingScreen: React.FC = () => {
  const {
    loadDailyReading,
    currentStreak,
    longestStreak,
    totalReadingDays,
    totalVersesRead,
    getTodayRecord,
    getWeeklyStats,
    isLoading,
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

  return (
    <ImageBackground
      source={LayoutImages.background2}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader
          title={i18n.t('dailyReading.title')}
          subtitle={i18n.t('dailyReading.subtitle')}
          showBackButton={true}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Streak Card */}
          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />

          {/* Stats Cards Row */}
          <View style={styles.statsRow}>
            <StatsCard
              title={i18n.t('dailyReading.todayVerses')}
              value={todayVerses.toString()}
              icon="📖"
            />
            <StatsCard
              title={i18n.t('dailyReading.totalDays')}
              value={totalReadingDays.toString()}
              icon="📅"
            />
          </View>

          <View style={styles.statsRow}>
            <StatsCard
              title={i18n.t('dailyReading.totalVerses')}
              value={totalVersesRead.toString()}
              icon="✨"
            />
            <StatsCard
              title={i18n.t('dailyReading.longestStreak')}
              value={longestStreak.toString()}
              icon="🔥"
            />
          </View>

          {/* Weekly Chart */}
          {weeklyStats.length > 0 && (
            <WeeklyChart data={weeklyStats} />
          )}

          {/* Motivational Message */}
          <ThemedCard variant="card" style={styles.motivationCard}>
            <ThemedLanguageText
              variant="primary"
              size="medium"
              style={styles.motivationText}
              fontFamily="regional_secondary"
            >
              {currentStreak > 0
                ? i18n.t('dailyReading.streakMessage', { count: currentStreak })
                : i18n.t('dailyReading.startMessage')}
            </ThemedLanguageText>
          </ThemedCard>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

