import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { WavePattern } from '@/illustration/cardBackground';
import { Dimensions, ScrollView } from 'react-native';
import { HeroSection, HomeHeader, MenuGrid, QuickActions } from './components';
import { styles } from './HomeScreen.styles';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';

export const HomeScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');

  useHomeInitialization();
  const { handleMenuItemPress } = useHomeNavigation();

  return (
    <ThemedView variant='primary' style={styles.container}>
      <WavePattern width={width} height={height} />

      <HomeHeader />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <QuickActions />
        <MenuGrid onMenuItemPress={handleMenuItemPress} />
      </ScrollView>
    </ThemedView>
  );
};

