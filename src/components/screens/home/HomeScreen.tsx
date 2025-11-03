import { DailySlokaNotification } from '@/components/notification';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { MenuItem } from '@/constants/menuData';
import { WavePattern } from '@/illustration/cardBackground';
import { useChapterStore, useNotificationStore } from '@/store';
import { getRandomSloka } from '@/store/utils/notificationUtils';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, ScrollView, StyleSheet } from 'react-native';
import MenuGrid from './MenuGrid';
import { getNavigationHandler } from './navigationHandlers';
import { HeroSection, HomeHeader, QuickActions } from './components';

export const HomeScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const {
    dailySloka,
    isNotificationVisible,
    shouldShowNewNotification,
    hasNotification,
    setDailySloka,
    setNotificationVisible,
  } = useNotificationStore();
  const { loadAllChapters } = useChapterStore();

  useEffect(() => {
    const initializeApp = async () => {
      await loadAllChapters();

      if (shouldShowNewNotification()) {
        const newSloka = getRandomSloka();
        setDailySloka(newSloka);
        setNotificationVisible(true);
      }
    };

    initializeApp();
  }, [loadAllChapters, shouldShowNewNotification, setDailySloka, setNotificationVisible]);

  const handleMenuItemPress = (item: MenuItem) => {
    const handler = getNavigationHandler(item);
    handler();
  };

  const handleNotificationClose = () => {
    setNotificationVisible(false);
  };

  const handleReadMore = () => {
    setNotificationVisible(false);

    if (dailySloka?.chapterId && dailySloka.chapterId !== 'unknown') {
      try {
        router.push(`/chapter/${dailySloka.chapterId}`);
      } catch (error) {
        console.error('Navigation error:', error);
        try {
          router.push('/(tabs)/chapters');
        } catch (fallbackError) {
          console.error('Fallback navigation error:', fallbackError);
        }
      }
    } else {
      try {
        router.push('/(tabs)/chapters');
      } catch (error) {
        console.error('Fallback navigation error:', error);
      }
    }
  };

  const handleBellPress = () => {
    if (isNotificationVisible) {
      setNotificationVisible(false);
    } else if (hasNotification()) {
      setNotificationVisible(true);
    }
  };

  return (
    <ThemedView variant='primary' style={styles.container}>
      <WavePattern width={width} height={height} />

      <HomeHeader
        isNotificationVisible={isNotificationVisible}
        hasNotification={hasNotification()}
        onBellPress={handleBellPress}
      />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <QuickActions />
        <MenuGrid onMenuItemPress={handleMenuItemPress} />
      </ScrollView>

      <DailySlokaNotification
        visible={isNotificationVisible}
        sloka={dailySloka}
        onClose={handleNotificationClose}
        onReadMore={handleReadMore}
      />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
});

