import { getLanguageFonts } from '@/interface/font.interface';
import { colors } from '@/rootconstants/tint';
import { HomeImages } from '@/utils/assets';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

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
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;
  const textSlideAnim = useRef(new Animated.Value(50)).current;
  const taglineFadeAnim = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const particleAnim1 = useRef(new Animated.Value(0)).current;
  const particleAnim2 = useRef(new Animated.Value(0)).current;
  const particleAnim3 = useRef(new Animated.Value(0)).current;
  const particleAnim4 = useRef(new Animated.Value(0)).current;
  const particleAnim5 = useRef(new Animated.Value(0)).current;
  const circleScaleAnim = useRef(new Animated.Value(0)).current;
  const circleRotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Background circle animation
    Animated.parallel([
      Animated.spring(circleScaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.timing(circleRotateAnim, {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
        })
      ),
    ]).start();

    // Main animation sequence
    const animationSequence = Animated.parallel([
      // Logo animations with rotation
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
        Animated.parallel([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ]),
      
      // App name animation
      Animated.sequence([
        Animated.delay(500),
        Animated.parallel([
          Animated.timing(textFadeAnim, {
            toValue: 1,
            duration: 700,
            useNativeDriver: true,
          }),
          Animated.spring(textSlideAnim, {
            toValue: 0,
            tension: 40,
            friction: 8,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Tagline animation (delayed after app name)
      Animated.sequence([
        Animated.delay(900),
        Animated.timing(taglineFadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),

      // Particle animations (staggered)
      Animated.parallel([
        Animated.sequence([
          Animated.delay(300),
          Animated.timing(particleAnim1, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(450),
          Animated.timing(particleAnim2, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(600),
          Animated.timing(particleAnim3, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(750),
          Animated.timing(particleAnim4, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.delay(900),
          Animated.timing(particleAnim5, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]),

      // Shimmer effect
      Animated.sequence([
        Animated.delay(800),
        Animated.loop(
          Animated.sequence([
            Animated.timing(shimmerAnim, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(shimmerAnim, {
              toValue: 0,
              duration: 2000,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onAnimationComplete]);

  // Logo rotation interpolation (subtle rotation)
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '5deg', '0deg'],
  });

  // Circle rotation interpolation
  const circleRotate = circleRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Shimmer interpolation
  const shimmerTranslateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 1.5, width * 1.5],
  });

  // Particle animations with varied paths
  const particle1Opacity = particleAnim1.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.8, 0.8, 0],
  });
  
  const particle1TranslateY = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -150],
  });

  const particle1TranslateX = particleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -30],
  });

  const particle2Opacity = particleAnim2.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.7, 0.7, 0],
  });
  
  const particle2TranslateY = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -120],
  });

  const particle2TranslateX = particleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const particle3Opacity = particleAnim3.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.6, 0.6, 0],
  });
  
  const particle3TranslateY = particleAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -180],
  });

  const particle4Opacity = particleAnim4.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.5, 0.5, 0],
  });
  
  const particle4TranslateY = particleAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -100],
  });

  const particle4TranslateX = particleAnim4.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -50],
  });

  const particle5Opacity = particleAnim5.interpolate({
    inputRange: [0, 0.3, 0.7, 1],
    outputRange: [0, 0.6, 0.6, 0],
  });
  
  const particle5TranslateY = particleAnim5.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -140],
  });

  const particle5TranslateX = particleAnim5.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 35],
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
      {/* Animated background circle */}
      <Animated.View
        style={[
          styles.backgroundCircle,
          {
            transform: [
              { scale: circleScaleAnim },
              { rotate: circleRotate },
            ],
          },
        ]}
      />

      {/* Decorative floating particles */}
      <Animated.View
        style={[
          styles.particle,
          styles.particle1,
          {
            opacity: particle1Opacity,
            transform: [
              { translateY: particle1TranslateY },
              { translateX: particle1TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle2,
          {
            opacity: particle2Opacity,
            transform: [
              { translateY: particle2TranslateY },
              { translateX: particle2TranslateX },
            ],
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
      <Animated.View
        style={[
          styles.particle,
          styles.particle4,
          {
            opacity: particle4Opacity,
            transform: [
              { translateY: particle4TranslateY },
              { translateX: particle4TranslateX },
            ],
          },
        ]}
      />
      <Animated.View
        style={[
          styles.particle,
          styles.particle5,
          {
            opacity: particle5Opacity,
            transform: [
              { translateY: particle5TranslateY },
              { translateX: particle5TranslateX },
            ],
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

      {/* Main content container */}
      <View style={styles.content}>
        {/* Logo section with enhanced animations */}
        <Animated.View
          style={[
            styles.logoSection,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { rotate: rotate },
              ],
            },
          ]}
        >
          <View style={styles.logoContainer}>
            <Image
              source={HomeImages.logo}
              style={styles.logo}
              resizeMode="contain"
            />
            {/* Glow effect behind logo */}
            <View style={styles.logoGlow} />
          </View>
        </Animated.View>

        {/* Text section with organized hierarchy */}
        <View style={styles.textSection}>
          <Animated.View
            style={[
              styles.appNameContainer,
              {
                opacity: textFadeAnim,
                transform: [{ translateY: textSlideAnim }],
              },
            ]}
          >
            <Text style={styles.appName}>
              গীতা বাংলা
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.taglineContainer,
              {
                opacity: taglineFadeAnim,
              },
            ]}
          >
            <View style={styles.taglineDivider} />
            <Text style={styles.tagline}>
              শ্রীকৃষ্ণের বাণী
            </Text>
            <View style={styles.taglineDivider} />
          </Animated.View>
        </View>

        {/* Bottom decorative elements */}
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
  backgroundCircle: {
    position: 'absolute',
    width: width * 1.5,
    height: width * 1.5,
    borderRadius: (width * 1.5) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -width * 0.3,
    right: -width * 0.3,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    width: '100%',
    paddingHorizontal: 40,
  },
  logoSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.secondary50,
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  logoGlow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    zIndex: -1,
    top: -20,
    left: -20,
  },
  logo: {
    width: 140,
    height: 140,
    zIndex: 1,
  },
  textSection: {
    alignItems: 'center',
    width: '100%',
    marginTop: 20,
  },
  appNameContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 48,
    fontWeight: '700',
    color: colors.secondary50,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
    letterSpacing: 2,
    fontFamily: languageFonts.regional_secondary,
    lineHeight: 58,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  taglineDivider: {
    width: 30,
    height: 1,
    backgroundColor: colors.secondary200,
    opacity: 0.5,
    marginHorizontal: 12,
  },
  tagline: {
    fontSize: 20,
    color: colors.secondary100,
    textAlign: 'center',
    opacity: 0.95,
    fontFamily: languageFonts.regional_secondary,
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: colors.primary200,
  },
  particle1: {
    width: 50,
    height: 50,
    top: '15%',
    left: '10%',
    borderRadius: 25,
  },
  particle2: {
    width: 40,
    height: 40,
    top: '25%',
    right: '15%',
    borderRadius: 20,
  },
  particle3: {
    width: 65,
    height: 65,
    top: '20%',
    left: '45%',
    borderRadius: 32.5,
  },
  particle4: {
    width: 35,
    height: 35,
    top: '35%',
    left: '20%',
    borderRadius: 17.5,
  },
  particle5: {
    width: 45,
    height: 45,
    top: '30%',
    right: '25%',
    borderRadius: 22.5,
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: width * 0.4,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1,
    transform: [{ skewX: '-20deg' }],
  },
  decorativeContainer: {
    position: 'absolute',
    bottom: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    zIndex: 2,
  },
  decorativeDot: {
    borderRadius: 50,
    backgroundColor: colors.secondary200,
    opacity: 0.7,
  },
  decorativeDot1: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  decorativeDot2: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  decorativeDot3: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

