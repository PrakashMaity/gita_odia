import i18n from '@/lib/i18n';
import { colors } from '@/rootconstants/tint';
import { getLanguageFonts } from '@/types/font.interface';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const languageFonts = getLanguageFonts();

interface OnboardingNavigationProps {
  currentSlide: number;
  totalSlides: number;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

export const OnboardingNavigation: React.FC<OnboardingNavigationProps> = ({
  currentSlide,
  totalSlides,
  isFirstSlide,
  isLastSlide,
  onPrevious,
  onNext,
}) => {
  return (
    <View style={styles.container}>
      {/* Dot Indicators */}
      <View style={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <DotIndicator key={index} active={index === currentSlide} />
        ))}
      </View>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        {!isFirstSlide && (
          <Pressable
            onPress={onPrevious}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && { opacity: 0.7, transform: [{ scale: 0.97 }] },
            ]}
          >
            <Text style={styles.secondaryButtonText}>
              {i18n.t('onboarding.previous')}
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={onNext}
          style={({ pressed }) => [
            styles.primaryButtonWrapper,
            !isFirstSlide ? { flex: 2 } : { flex: 1 },
            pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
          ]}
        >
          <LinearGradient
            colors={[colors.primary100, colors.primary50]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryButtonText}>
              {isLastSlide ? i18n.t('onboarding.start') : i18n.t('onboarding.next')}
            </Text>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
};

/** Animated dot indicator */
const DotIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  const widthAnim = useRef(new Animated.Value(active ? 24 : 8)).current;
  const opacityAnim = useRef(new Animated.Value(active ? 1 : 0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: active ? 24 : 8,
        tension: 80,
        friction: 10,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: active ? 1 : 0.4,
        duration: 200,
        useNativeDriver: false,
      }),
    ]).start();
  }, [active]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: widthAnim,
          opacity: opacityAnim,
          backgroundColor: active ? colors.primary50 : colors.secondary300,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    gap: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: colors.secondary200,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.secondary200,
    fontFamily: languageFonts.regional_secondary,
  },
  primaryButtonWrapper: {
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: colors.primary50,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: languageFonts.regional_secondary,
    letterSpacing: 0.5,
  },
});
