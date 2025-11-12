import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { HomeImages } from '@/utils/assets';
import { ImageBackground, ScrollView } from 'react-native';
import { HeroSection, HomeHeader, MenuGrid, QuickActions, PromotionalModal } from './components';
import { styles } from './HomeScreen.styles';
import { useHomeInitialization } from './hooks/useHomeInitialization';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { useState, useEffect } from 'react';

export const HomeScreen: React.FC = () => {
  useHomeInitialization();
  const { handleMenuItemPress } = useHomeNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Show modal on mount (you can change this logic as needed)
  useEffect(() => {
    // Show modal after a short delay for better UX
    const timer = setTimeout(() => {
      setIsModalVisible(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCloseModal = () => {
    setIsModalVisible(false);
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

