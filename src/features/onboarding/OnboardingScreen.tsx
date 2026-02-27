import i18n from '@/lib/i18n';
import { colors } from '@/rootconstants/tint';
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
const languageFonts = getLanguageFonts();

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
      await new Promise(resolve => setTimeout(resolve, 500));
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      router.replace('/(tabs)');
    }
  };

  const skip = () => {
    handleComplete();
  };

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
      colors={['#FFF8E1', '#FFECB3', '#FFE0B2', '#FFCC80']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      {/* Skip button */}
      <View style={styles.header}>
        <Pressable
          onPress={skip}
          style={({ pressed }) => [
            styles.skipButton,
            pressed && { opacity: 0.6 },
          ]}
        >
          <Text style={styles.skipText}>
            {i18n.t('onboarding.skip')}
          </Text>
        </Pressable>
      </View>

      {/* Main content with FlatList */}
      <View style={styles.content}>
        <FlatList
          ref={flatListRef}
          data={slides}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ width }}>
              <OnboardingSlide slide={item} />
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

      {/* Navigation — always visible at bottom */}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  skipText: {
    fontSize: 15,
    color: colors.secondary200,
    fontFamily: languageFonts.regional_secondary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});
