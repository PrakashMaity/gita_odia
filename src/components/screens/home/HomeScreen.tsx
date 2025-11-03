import { DailySlokaNotification } from '@/components/notification';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { useNotificationStore } from '@/store';
import { Dimensions, ScrollView } from 'react-native';
import { HeroSection, HomeHeader, MenuGrid, QuickActions } from './components';
import { styles } from './HomeScreen.styles';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { useHomeNotification } from './hooks/useHomeNotification';

export const HomeScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const {
    dailySloka,
    isNotificationVisible,
    hasNotification,
  } = useNotificationStore();

  useHomeInitialization();
  const { handleMenuItemPress } = useHomeNavigation();
  const { handleNotificationClose, handleReadMore, handleBellPress } = useHomeNotification();

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

