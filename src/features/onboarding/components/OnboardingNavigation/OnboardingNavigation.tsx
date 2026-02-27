import i18n from '@/lib/i18n';
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

const fonts = getLanguageFonts();

// Premium golden palette
const COLORS = {
  dotActive: '#D97706',
  dotInactive: 'rgba(146,64,14,0.25)',
  secondaryBg: 'rgba(255,255,255,0.65)',
  secondaryBorder: 'rgba(255,255,255,0.8)',
  secondaryText: '#5D4037',
  secondaryShadow: '#B45309',
  primaryGrad1: '#D97706',
  primaryGrad2: '#F59E0B',
  primaryGrad3: '#FBBF24',
  primaryShadow: '#B45309',
  primaryText: '#FFFFFF',
};

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
              pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
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
            pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
          ]}
        >
          <LinearGradient
            colors={[COLORS.primaryGrad1, COLORS.primaryGrad2, COLORS.primaryGrad3]}
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

/** Animated dot indicator with golden accent */
const DotIndicator: React.FC<{ active: boolean }> = ({ active }) => {
  const widthAnim = useRef(new Animated.Value(active ? 28 : 8)).current;
  const opacityAnim = useRef(new Animated.Value(active ? 1 : 0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(widthAnim, {
        toValue: active ? 28 : 8,
        tension: 80,
        friction: 10,
        useNativeDriver: false,
      }),
      Animated.timing(opacityAnim, {
        toValue: active ? 1 : 0.5,
        duration: 250,
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
          backgroundColor: active ? COLORS.dotActive : COLORS.dotInactive,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingTop: 14,
    paddingBottom: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
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
    height: 58,
    borderRadius: 20,
    backgroundColor: COLORS.secondaryBg,
    borderWidth: 1,
    borderColor: COLORS.secondaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.secondaryShadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.secondaryText,
    fontFamily: fonts.regional_secondary,
  },
  primaryButtonWrapper: {
    height: 58,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.primaryShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.primaryText,
    fontFamily: fonts.regional_secondary,
    letterSpacing: 0.5,
  },
});
