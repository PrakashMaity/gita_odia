import i18n from '@/lib/i18n';
import { useSettingsStore } from '@/store';
import { getLanguageFonts } from '@/types/font.interface';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Dimensions,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { OnboardingNavigation } from './components/OnboardingNavigation';
import { OnboardingSlide } from './components/OnboardingSlide';
import { useOnboardingData } from './hooks/useOnboardingData';

const { width } = Dimensions.get('window');
const fonts = getLanguageFonts();

// Premium golden gradient palette
const COLORS = {
  gradientStart: '#FFFBF0',    // Warm cream white
  gradientMid1: '#FFF3D6',     // Light golden
  gradientMid2: '#FFE4A8',     // Warm amber
  gradientEnd: '#FFD06B',      // Rich golden
  skipBg: 'rgba(146,64,14,0.12)',
  skipText: '#92400E',         // Deep amber brown
};

export const OnboardingScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { slides } = useOnboardingData();
  const { updateSetting } = useSettingsStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;
  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const handleComplete = async () => {
    try {
      updateSetting('onboardingCompleted', true);
      await new Promise(resolve => setTimeout(resolve, 300));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/(tabs)');
    }
  };

  const skip = () => handleComplete();

  const next = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      handleComplete();
    }
  };

  const previous = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({ index: currentIndex - 1, animated: true });
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid1, COLORS.gradientMid2, COLORS.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Decorative top circle glow */}
      <View style={styles.glowCircle} />

      {/* Skip button */}
      <View style={styles.header}>
        <Pressable
          onPress={skip}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
          ]}
        >
          <Text style={styles.skipText}>
            {i18n.t('onboarding.skip')}
          </Text>
        </Pressable>
      </View>

      {/* Main content */}
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <View style={{ width, height: '100%' }}>
              <OnboardingSlide slide={item} slideIndex={index} />
            </View>
          )}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          bounces={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          scrollEventThrottle={32}
        />
      </View>

      {/* Navigation */}
      <OnboardingNavigation
        currentSlide={currentIndex}
        totalSlides={slides.length}
        isFirstSlide={currentIndex === 0}
        isLastSlide={currentIndex === slides.length - 1}
        onPrevious={previous}
        onNext={next}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  glowCircle: {
    position: 'absolute',
    top: -120,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(251,191,36,0.15)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  skipButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: COLORS.skipBg,
    borderWidth: 1,
    borderColor: 'rgba(146,64,14,0.15)',
  },
  skipText: {
    fontSize: 14,
    color: COLORS.skipText,
    fontFamily: fonts.regional_secondary,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
