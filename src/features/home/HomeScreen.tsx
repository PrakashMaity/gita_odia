import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import { ProUpgradeModal } from '@/features/subscription/components/ProUpgradeModal';
import { useProStatus } from '@/hooks/useProStatus';
import { HomeImages } from '@/lib/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { HeroQuote, HomeHeader, MenuGrid, QuickActions } from './components';
import { ProActivationModal } from './components/ProActivationModal';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { useProActivationPopup } from './hooks/useProActivationPopup';

export const HomeScreen: React.FC = () => {
  useHomeInitialization();
  const { isPro } = useProStatus();
  const {
    handleMenuItemPress,
    isUpgradeModalVisible,
    lockedFeatureName,
    closeUpgradeModal
  } = useHomeNavigation();
  const { isPopupVisible, handleClosePopup } = useProActivationPopup();

  return (
    <ImageBackground
      source={HomeImages.background}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={0.5}
    >
      <Box className="flex-1 relative">
        {/* ─── Section: Header ─── */}
        <HomeHeader />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 32 }}
          style={{ flex: 1 }}
        >
          <VStack space="md" className="py-2">
            {/* ─── Section: Hero Quote ─── */}
            <HeroQuote />

            {/* ─── Section: Quick Actions ─── */}
            <QuickActions />

            {/* ─── Section: Menu Categories ─── */}
            <MenuGrid onMenuItemPress={handleMenuItemPress} />
          </VStack>
        </ScrollView>

        {/* ─── Overlays: Subscription/Pro ─── */}
        <ProActivationModal visible={isPopupVisible} onClose={handleClosePopup} />

        <ProUpgradeModal
          visible={isUpgradeModalVisible}
          onClose={closeUpgradeModal}
          featureName={lockedFeatureName}
        />
      </Box>
    </ImageBackground>
  );
};
