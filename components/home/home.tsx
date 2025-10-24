import { DailySlokaNotification } from '@/components/notification';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { MenuItem } from '@/constants/menuData';
import { SIZES } from '@/constants/sizes';
import { useThemeColors, useThemeMode } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { useChapterStore, useNotificationStore } from '@/store';
import { getRandomSloka } from '@/store/utils/notificationUtils';
import { HomeImages } from '@/utils/assets';
import { FontAwesome } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/build/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/build/FontAwesome6';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedButton } from '../ui/ThemedButton';
import MenuGrid from './MenuGrid';
import { getNavigationHandler } from './navigationHandlers';



const Home = () => {
  const theme = useThemeColors();
  const { width, height } = Dimensions.get('window');
  const {
    dailySloka,
    isNotificationVisible,
    shouldShowNewNotification,
    hasNotification,
    setDailySloka,
    setNotificationVisible,
  } = useNotificationStore();
  const { isDark } = useThemeMode();
  const { loadAllChapters } = useChapterStore();
  

  // Load chapters and check for daily sloka on component mount
  useEffect(() => {
    const initializeApp = async () => {
      // Ensure chapters are loaded first
      await loadAllChapters();

      if (shouldShowNewNotification()) {
        const newSloka = getRandomSloka();
        setDailySloka(newSloka);
        // Auto-show notification for new daily sloka
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
      console.log('Navigating to chapter:', dailySloka.chapterId);
      console.log('Full sloka data:', dailySloka);
      try {
        // Try the main navigation first
        router.push(`/chapter/${dailySloka.chapterId}`);
      } catch (error) {
        console.error('Navigation error:', error);
        // Fallback: try navigating to chapters tab first
        try {
          router.push('/(tabs)/chapters');
        } catch (fallbackError) {
          console.error('Fallback navigation error:', fallbackError);
        }
      }
    } else {
      console.error('No valid chapter ID available for navigation');
      console.log('Daily sloka data:', dailySloka);
      // Fallback: navigate to chapters tab
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
      <WavePattern
        width={width}
        height={height}
      />


      <ThemedCard variant='transparent' style={styles.headerCard} pattern="none">
        <ThemedView >

        <Image source={HomeImages.logo} style={styles.logo} />
        
        </ThemedView>
        <ThemedLanguageText
          variant="primary"
          size="title"
          fontFamily="regional_secondary"
        >
          {i18n.t("home.headerTitle")}
        </ThemedLanguageText>


        <ThemedView style={styles.headerActions}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              {
                borderColor: theme.border.primary,
                backgroundColor: isNotificationVisible ? theme.button.primary.background : 'transparent'
              }
            ]}
            onPress={handleBellPress}
            testID="bell-icon"
          >
            <FontAwesome
              name={isNotificationVisible ? "bell" : "bell-o"}
              size={SIZES.icon.xs}
              color={isNotificationVisible ? theme.button.primary.text : (hasNotification() ? theme.status.warning : theme.icon.primary)}
            />
            {hasNotification() && !isNotificationVisible && (
              <ThemedView style={[styles.notificationDot, { backgroundColor: theme.status.error }]} />
            )}
          </TouchableOpacity>
        </ThemedView>
      </ThemedCard>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <ThemedCard variant='primary' style={styles.heroCard} pattern="sacredGeometry" patternOpacity={0.15}>
          <ThemedView style={styles.heroContainer}>
            <Image source={isDark ?HomeImages.heroDark:HomeImages.hero} resizeMode='cover' style={styles.heroImage} />
            <ThemedView style={styles.textOverlay}>
              <ThemedLanguageText
                variant="primary"
                size="xxl"
                fontFamily="regional_secondary"
                style={styles.overlayText}
              >
                {i18n.t('home.heroQuote')}
              </ThemedLanguageText>
            </ThemedView>
          </ThemedView>
        </ThemedCard>

        <ThemedCard variant='transparent' style={styles.quickActionsCard}>
          <ThemedButton
            title={i18n.t('gitaSummary.title')}
            onPress={() => {
              
              getNavigationHandler({ id: 'gita-summary' } as MenuItem)();  
            }}
            variant="basic"
            size="md"
            fullWidth
            icon={<FontAwesome6 name="book-bookmark" size={SIZES.icon.lg} color={theme.button.primary.text} />}
          />
          <ThemedButton
            title={i18n.t('gitaMahatmya.title')}
            onPress={() => {
              
              getNavigationHandler({ id: 'gita-mahatmya' } as MenuItem)();
            }}
            variant="basic"
            size="md"
            fullWidth
            icon={<FontAwesome5 name="book" size={SIZES.icon.lg} color={theme.button.secondary.text} />}
          />
        </ThemedCard>


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
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

  },
  logo: {
    width: 64,
    height: 64,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  actionButton: {
    borderWidth: 1,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.md,
    // minWidth: 24,
    // minHeight: 24,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  heroCard: {
    margin: 16,
    marginBottom: 8,
  },
  heroContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 180,

  },

  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayText: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  quickActionsCard: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.sm,
  },
});

export default Home;