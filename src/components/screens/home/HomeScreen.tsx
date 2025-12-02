import { ResponsiveContainer } from '@/components/ui/ResponsiveContainer/ResponsiveContainer';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { HomeImages } from '@/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { HeroSection, HomeHeader, MenuGrid, QuickActions } from './components';
import { styles } from './HomeScreen.styles';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { ThemedSpacer } from '@/components/ui/ThemedSpacer/ThemedSpacer';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';




export const HomeScreen: React.FC = () => {
  useHomeInitialization();
  const { handleMenuItemPress } = useHomeNavigation();
  const layout = useDeviceLayout();

  return (
    <ImageBackground
      source={HomeImages.background}
      style={styles.backgroundImage}
      resizeMode='cover'
      blurRadius={.5}
    >
      <ThemedView variant='transparent' style={styles.container}>
        <ResponsiveContainer horizontalPadding={layout.isTablet ? layout.horizontalPadding : 0}>
          <HomeHeader />
        </ResponsiveContainer>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: layout.sectionSpacing },
          ]}
        >
          <ResponsiveContainer
            horizontalPadding={layout.isTablet ? layout.horizontalPadding : 0}
            contentStyle={styles.contentStack}
          >
            <HeroSection />
            <QuickActions />
            <ThemedSpacer size='lg' />
            <MenuGrid onMenuItemPress={handleMenuItemPress} />
          </ResponsiveContainer>
        </ScrollView>

        {/* <PromotionalModal visible={isModalVisible} onClose={handleCloseModal} /> */}
      </ThemedView>
    </ImageBackground>
  );
};

