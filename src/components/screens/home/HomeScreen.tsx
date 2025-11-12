import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { HomeImages } from '@/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { HeroSection, HomeHeader, MenuGrid, QuickActions, PromotionalModal } from './components';
import { styles } from './HomeScreen.styles';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { useState, useEffect } from 'react';
import { fetchPromotions } from '@/services/promotionService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LAST_PROMOTION_MODAL_SHOWN_KEY = 'last_promotion_modal_shown_date';

/**
 * Check if modal should be shown (once per day)
 */
const shouldShowModal = async (): Promise<boolean> => {
  try {
    const lastShownDate = await AsyncStorage.getItem(LAST_PROMOTION_MODAL_SHOWN_KEY);
    if (!lastShownDate) {
      return true; // Never shown before
    }

    const lastShown = new Date(lastShownDate);
    const today = new Date();
    
    // Check if it's a different day
    const isDifferentDay = 
      lastShown.getDate() !== today.getDate() ||
      lastShown.getMonth() !== today.getMonth() ||
      lastShown.getFullYear() !== today.getFullYear();
    
    return isDifferentDay;
  } catch (error) {
    console.error('Error checking modal show status:', error);
    return false; // Don't show on error
  }
};

/**
 * Mark that modal was shown today
 */
const markModalShown = async (): Promise<void> => {
  try {
    const today = new Date().toISOString();
    await AsyncStorage.setItem(LAST_PROMOTION_MODAL_SHOWN_KEY, today);
  } catch (error) {
    console.error('Error marking modal as shown:', error);
  }
};

export const HomeScreen: React.FC = () => {
  useHomeInitialization();
  const { handleMenuItemPress } = useHomeNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Check if modal should be shown (once per day and only if promotions exist)
  useEffect(() => {
    const checkAndShowModal = async () => {
      try {
        console.log('[HomeScreen] Checking if modal should be shown...');
        // First check if we should show based on date
        const canShowByDate = await shouldShowModal();
        if (!canShowByDate) {
          console.log('[HomeScreen] Modal already shown today, skipping');
          return; // Already shown today
        }

        // Check if there are any active promotions
        console.log('[HomeScreen] Fetching promotions to check availability...');
        const promotions = await fetchPromotions();
        console.log('[HomeScreen] Found', promotions.length, 'promotions');
        
        if (promotions.length === 0) {
          console.log('[HomeScreen] No promotions found, not showing modal');
          return; // No promotions to show
        }

        // Show modal after a short delay for better UX
        console.log('[HomeScreen] Showing modal with', promotions.length, 'promotions');
        const timer = setTimeout(() => {
          setIsModalVisible(true);
          markModalShown(); // Mark as shown
        }, 1000);
        
        return () => clearTimeout(timer);
      } catch (error) {
        console.error('[HomeScreen] Error checking promotions:', error);
        // Don't show modal on error
      }
    };

    checkAndShowModal();
  }, []);

  const handleCloseModal = async () => {
    setIsModalVisible(false);
    // Mark as shown when user closes the modal
    await markModalShown();
  };

  return (
    <ImageBackground
      source={HomeImages.background}
      style={styles.backgroundImage}
      resizeMode='cover'
      blurRadius={1.5}
    >
      <ThemedView variant='transparent' style={styles.container}>
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

        <PromotionalModal visible={isModalVisible} onClose={handleCloseModal} />
      </ThemedView>
    </ImageBackground>
  );
};

