import { BannerAdComponent } from '@/components/ads';
import { LockedCardOverlay, PageHeader, ProUpgradeModal } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { SIZES } from '@/rootconstants/sizes';
import { useDailyReadingStore } from '@/store/dailyReadingStore';
import { LayoutImages } from '@/utils/assets';
import React, { useEffect, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, View } from 'react-native';
import { QuickActionButtons } from './components/QuickActionButtons';
import { StatsCard } from './components/StatsCard';
import { StreakCard } from './components/StreakCard';
import { WeeklyChart } from './components/WeeklyChart';
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
  const theme = useThemeColors();
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);

  const { width, height } = Dimensions.get('window');

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
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
          {/* Quick Action Buttons */}
          <QuickActionButtons />

          {/* Streak Card */}
          <StreakCard
            currentStreak={currentStreak}
            longestStreak={longestStreak}
          />

          {/* Stats Section */}
          <ThemedView style={styles.statsSection}>
            <ThemedView style={styles.sectionHeader}>
              <ThemedView style={[styles.sectionIndicator, { backgroundColor: theme.status.info + '40' }]} />
              <ThemedLanguageText 
                variant="primary" 
                size="large" 
                fontFamily="regional_secondary"
                style={styles.sectionTitle}
              >
                {i18n.t('dailyReading.statsTitle')}
              </ThemedLanguageText>
            </ThemedView>

            {/* Stats Cards Row */}
            <View style={styles.statsRow}>
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
            </View>

            <View style={styles.statsRow}>
              <LockedCardOverlay
                isLocked={!isPro}
                onPress={() => setShowProModal(true)}
                style={{ flex: 1 }}
              >
                <StatsCard
                  title={i18n.t('dailyReading.totalVerses')}
                  value={totalVersesRead.toString()}
                  iconName="library-outline"
                />
              </LockedCardOverlay>
              <LockedCardOverlay
                isLocked={!isPro}
                onPress={() => setShowProModal(true)}
                style={{ flex: 1 }}
              >
                <StatsCard
                  title={i18n.t('dailyReading.longestStreak')}
                  value={longestStreak.toString()}
                  iconName="flame-outline"
                />
              </LockedCardOverlay>
            </View>
          </ThemedView>

          {/* Weekly Chart */}
          {weeklyStats.length > 0 && (
            <LockedCardOverlay
              isLocked={!isPro}
              onPress={() => setShowProModal(true)}
            >
              <WeeklyChart data={weeklyStats} />
            </LockedCardOverlay>
          )}

          {/* Motivational Message */}
          <ThemedCard variant="card" style={styles.motivationCard} borderVariant="primary">
            <ThemedView style={styles.motivationHeader}>
              <ThemedView style={[styles.motivationIndicator, { backgroundColor: theme.status.success + '40' }]} />
              <ThemedLanguageText 
                variant="primary" 
                size="large" 
                fontFamily="regional_secondary"
                style={styles.motivationTitle}
              >
                {i18n.t('dailyReading.motivationTitle')}
              </ThemedLanguageText>
            </ThemedView>
            <ThemedLanguageText
              variant="secondary"
              size="medium"
              style={styles.motivationText}
              fontFamily="regional_secondary"
            >
              {currentStreak > 0
                ? i18n.t('dailyReading.streakMessage', { count: currentStreak })
                : i18n.t('dailyReading.startMessage')}
            </ThemedLanguageText>
          </ThemedCard>

          {/* Banner Ad */}
          <ThemedView style={{ paddingHorizontal: SIZES.spacing.md, marginTop: SIZES.spacing.lg }}>
            <BannerAdComponent />
          </ThemedView>
        </ScrollView>
        <ProUpgradeModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
        />
      </ThemedView>
    </ImageBackground>
  );
};

