import { BannerAdComponent } from '@/components/ads';
import { ThemedSpacer } from '@/components/ui/ThemedSpacer/ThemedSpacer';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { SIZES } from '@/rootconstants/sizes';
import { HomeImages } from '@/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { HeroSection, HomeHeader, MenuGrid, QuickActions } from './components';
import { ProActivationModal } from './components/ProActivationModal';
import { styles } from './HomeScreen.styles';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { useProActivationPopup } from './hooks/useProActivationPopup';




export const HomeScreen: React.FC = () => {
  useHomeInitialization();
  const { handleMenuItemPress } = useHomeNavigation();
  const { isPopupVisible, handleClosePopup } = useProActivationPopup();

  return (
    <ImageBackground
      source={HomeImages.background}
      style={styles.backgroundImage}
      resizeMode='cover'
      blurRadius={.5}
    >
      <ThemedView variant='transparent' style={styles.container}>
        <HomeHeader />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
        <ThemedSpacer size='xs' />
          <HeroSection />
          <QuickActions />
          <ThemedSpacer size='lg' />
          <MenuGrid onMenuItemPress={handleMenuItemPress} />
          <ThemedSpacer size='lg' />
          <ThemedView style={{ paddingHorizontal: SIZES.spacing.md }}>
            <BannerAdComponent />
          </ThemedView>
          <ThemedSpacer size='md' />
        </ScrollView>

        <ProActivationModal visible={isPopupVisible} onClose={handleClosePopup} />
      </ThemedView>
    </ImageBackground>
  );
};
