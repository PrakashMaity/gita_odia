import { HomeImages } from '@/utils/assets';
import { colors } from '@/rootconstants/tint';
import { getLanguageFonts } from '@/interface/font.interface';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashProps {
  onAnimationComplete?: () => void;
  duration?: number;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  onAnimationComplete,
  duration = 2000,
}) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Main animation sequence
    const animationSequence = Animated.parallel([
      // Logo animations
      Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            tension: 50,
            friction: 7,
            useNativeDriver: true,
          }),
        ]),
      ]),
      
      // Text animations (start after logo appears)
      Animated.sequence([
        Animated.delay(600),
        Animated.parallel([
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.timing(textSlideAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Particle animations
      Animated.parallel([
        Animated.sequence([
          Animated.delay(400),
          Animated.timing(particleAnim1, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(particleAnim2, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(800),
          Animated.timing(particleAnim3, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Shimmer effect
      Animated.sequence([
        Animated.delay(1000),
        Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnim, {
              toValue: 1,
              duration: 1500,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnim, {
              toValue: 0,
              duration: 1500,
              useNativeDriver: true,
            }),
          ])
        ),
      ]),
    ]);

    animationSequence.start();

    // Complete animation and callback
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, duration);

    return () => {
      clearTimeout(timer);
      animationSequence.stop();
    };
  }, [duration, onAnimationComplete]);

  // Shimmer interpolation
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  // Particle animations
  const particle1Opacity = particleAnim1.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });
  
  const particle1TranslateY = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const particle2Opacity = particleAnim2.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });
  
  const particle2TranslateY = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });

  const particle3Opacity = particleAnim3.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 1, 0],
  });
  
  const particle3TranslateY = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  return (
    <LinearGradient
      colors={[
        colors.primary600,  // Saffron cream
        colors.primary500,  // Light saffron
        colors.primary400,  // Golden saffron
        colors.primary300,  // Bright orange
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Decorative particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          {
            opacity: particle1Opacity,
            transform: [{ translateY: particle1TranslateY }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          {
            opacity: particle2Opacity,
            transform: [{ translateY: particle2TranslateY }],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle3,
          {
            opacity: particle3Opacity,
            transform: [{ translateY: particle3TranslateY }],
          },
        ]}
      />

      {/* Shimmer overlay */}
      <Animated.View
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerTranslateX }],
          },
        ]}
      />

      {/* Main content */}
      <View style={styles.content}>
        {/* Logo with animations */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
              ],
            },
          ]}
        >
          <Image
            source={HomeImages.logo}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        {/* App name with animations */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              opacity: textFadeAnim,
              transform: [{ translateY: textSlideAnim }],
            },
          ]}
        >
          <Text
            style={styles.appName}
          >
            গীতা বাংলা
          </Text>
          <Text
            style={styles.tagline}
          >
            শ্রীকৃষ্ণের বাণী
          </Text>
        </Animated.View>

        {/* Subtle decorative elements */}
        <View style={styles.decorativeContainer}>
          <View style={[styles.decorativeDot, styles.decorativeDot1]} />
          <View style={[styles.decorativeDot, styles.decorativeDot2]} />
          <View style={[styles.decorativeDot, styles.decorativeDot3]} />
        </View>
      </View>
    </LinearGradient>
  );
};

// Get font family for Bengali text
const languageFonts = getLanguageFonts();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  logoContainer: {
    marginBottom: 40,
    shadowColor: colors.secondary50,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appName: {
    fontSize: 42,
    fontWeight: '700',
    color: colors.secondary50,
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
    fontFamily: languageFonts.regional_secondary,
  },
  tagline: {
    fontSize: 18,
    color: colors.secondary100,
    textAlign: 'center',
    opacity: 0.9,
    fontStyle: 'italic',
    fontFamily: languageFonts.regional_secondary,
  },
  particle: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary200,
    opacity: 0.3,
  },
  particle1: {
    top: '20%',
    left: '15%',
  },
  particle2: {
    top: '30%',
    right: '20%',
  },
  particle3: {
    top: '25%',
    left: '50%',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width * 0.3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    zIndex: 1,
  },
  decorativeContainer: {
    position: 'absolute',
    bottom: 80,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.secondary200,
    opacity: 0.6,
  },
  decorativeDot1: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  decorativeDot2: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  decorativeDot3: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});

