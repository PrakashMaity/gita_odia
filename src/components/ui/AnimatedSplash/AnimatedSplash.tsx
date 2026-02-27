import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { getLanguageFonts } from '@/types/font.interface';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const fonts = getLanguageFonts();

// Premium golden color tokens
const COLORS = {
  gradientStart: '#FFFBF0',
  gradientMid1: '#FFF3D6',
  gradientMid2: '#FFE4A8',
  gradientEnd: '#FFD06B',
  title: '#1A0E0A',
  tagline: '#5D4037',
  amber: '#D97706',
  amberLight: '#F59E0B',
  amberGlow: '#FBBF24',
  ring: 'rgba(217,119,6,0.25)',
  ringOuter: 'rgba(251,191,36,0.12)',
  particleGold: 'rgba(251,191,36,0.35)',
  particleAmber: 'rgba(217,119,6,0.25)',
  divider: '#B45309',
};

interface AnimatedSplashProps {
  onAnimationComplete?: () => void;
  duration?: number;
}

export const AnimatedSplash: React.FC<AnimatedSplashProps> = ({
  onAnimationComplete,
  duration = 2800,
}) => {
  // ─── Animation values ───
  // Logo
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  // Ring pulse
  const ringScale = useRef(new Animated.Value(0.5)).current;
  const ringOpacity = useRef(new Animated.Value(0)).current;
  const outerRingScale = useRef(new Animated.Value(0.3)).current;
  const outerRingOpacity = useRef(new Animated.Value(0)).current;
  // Title
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(40)).current;
  // Tagline
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const taglineSlide = useRef(new Animated.Value(20)).current;
  // Divider lines
  const dividerWidth = useRef(new Animated.Value(0)).current;
  // Bottom Om icon
  const omScale = useRef(new Animated.Value(0)).current;
  const omOpacity = useRef(new Animated.Value(0)).current;
  // Floating particles (6 golden particles)
  const particles = useRef(
    Array.from({ length: 6 }, () => ({
      opacity: new Animated.Value(0),
      translateY: new Animated.Value(0),
      translateX: new Animated.Value(0),
      scale: new Animated.Value(0.5),
    }))
  ).current;
  // Shimmer
  const shimmerPos = useRef(new Animated.Value(-width)).current;
  // Background glow
  const glowScale = useRef(new Animated.Value(0.8)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // ─── Phase 1: Background glow + ring pulse ───
    const phase1 = Animated.parallel([
      Animated.timing(glowOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(glowScale, {
        toValue: 1,
        tension: 30,
        friction: 6,
        useNativeDriver: true,
      }),
      // Outer ring expand
      Animated.parallel([
        Animated.spring(outerRingScale, {
          toValue: 1,
          tension: 25,
          friction: 5,
          useNativeDriver: true,
        }),
        Animated.timing(outerRingOpacity, {
          toValue: 0.6,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // ─── Phase 2: Logo entrance ───
    const phase2 = Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      // Inner ring
      Animated.parallel([
        Animated.spring(ringScale, {
          toValue: 1,
          tension: 40,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(ringOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]);

    // ─── Phase 3: Title + subtle rotate ───
    const phase3 = Animated.parallel([
      Animated.spring(titleSlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      // Logo subtle rotation
      Animated.timing(logoRotate, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]);

    // ─── Phase 4: Tagline + divider ───
    const phase4 = Animated.parallel([
      Animated.spring(taglineSlide, {
        toValue: 0,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 450,
        useNativeDriver: true,
      }),
      Animated.spring(dividerWidth, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
    ]);

    // ─── Phase 5: Om icon + particles ───
    const phase5 = Animated.parallel([
      // Om icon bounce
      Animated.spring(omScale, {
        toValue: 1,
        tension: 80,
        friction: 5,
        useNativeDriver: true,
      }),
      Animated.timing(omOpacity, {
        toValue: 0.7,
        duration: 400,
        useNativeDriver: true,
      }),
      // Particles — staggered float-up
      ...particles.map((p, i) =>
        Animated.sequence([
          Animated.delay(i * 80),
          Animated.parallel([
            Animated.timing(p.opacity, {
              toValue: 0.7,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.spring(p.scale, {
              toValue: 1,
              tension: 40,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateY, {
              toValue: -(60 + Math.random() * 80),
              duration: 1200,
              useNativeDriver: true,
            }),
            Animated.timing(p.translateX, {
              toValue: (Math.random() - 0.5) * 80,
              duration: 1200,
              useNativeDriver: true,
            }),
          ]),
          // Fade out
          Animated.timing(p.opacity, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      ),
    ]);

    // ─── Shimmer sweep ───
    const shimmerAnim = Animated.sequence([
      Animated.delay(600),
      Animated.timing(shimmerPos, {
        toValue: width * 2,
        duration: 1800,
        useNativeDriver: true,
      }),
    ]);

    // ─── Run all phases sequentially ───
    const mainSequence = Animated.sequence([
      phase1,
      phase2,
      Animated.delay(100),
      phase3,
      Animated.delay(50),
      phase4,
      phase5,
    ]);

    Animated.parallel([mainSequence, shimmerAnim]).start();

    // Complete callback
    const timer = setTimeout(() => {
      onAnimationComplete?.();
    }, duration);

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [duration, onAnimationComplete]);

  // ─── Interpolations ───
  const rotate = logoRotate.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['0deg', '4deg', '0deg'],
  });

  const dividerScaleX = dividerWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  // Particle config positions (radial around logo)
  const PARTICLE_POSITIONS = [
    { top: '30%', left: '15%', size: 10 },
    { top: '25%', right: '18%', size: 14 },
    { top: '38%', left: '22%', size: 8 },
    { top: '20%', left: '50%', size: 12 },
    { top: '35%', right: '12%', size: 9 },
    { top: '28%', left: '8%', size: 11 },
  ];

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientMid1, COLORS.gradientMid2, COLORS.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.3, y: 1 }}
      style={styles.container}
    >
      {/* ─── Background glow circle ─── */}
      <Animated.View
        style={[
          styles.glowCircle,
          {
            opacity: glowOpacity,
            transform: [{ scale: glowScale }],
          },
        ]}
      />

      {/* ─── Shimmer sweep ─── */}
      <Animated.View
        style={[
          styles.shimmer,
          { transform: [{ translateX: shimmerPos }, { skewX: '-20deg' }] },
        ]}
      />

      {/* ─── Floating particles ─── */}
      {particles.map((p, i) => {
        const pos = PARTICLE_POSITIONS[i];
        return (
          <Animated.View
            key={i}
            style={[
              styles.particle,
              {
                top: pos.top,
                ...(pos.left !== undefined ? { left: pos.left } : {}),
                ...(pos.right !== undefined ? { right: pos.right } : {}),
                width: pos.size,
                height: pos.size,
                borderRadius: pos.size / 2,
                opacity: p.opacity,
                transform: [
                  { translateY: p.translateY },
                  { translateX: p.translateX },
                  { scale: p.scale },
                ],
              } as any,
            ]}
          />
        );
      })}

      {/* ─── Main Content ─── */}
      <View style={styles.content}>
        {/* Outer pulsing ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              opacity: outerRingOpacity,
              transform: [{ scale: outerRingScale }],
            },
          ]}
        />

        {/* Inner golden ring */}
        <Animated.View
          style={[
            styles.innerRing,
            {
              opacity: ringOpacity,
              transform: [{ scale: ringScale }],
            },
          ]}
        />

        {/* Logo */}
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }, { rotate }],
            },
          ]}
        >
          <LinearGradient
            colors={[COLORS.amberGlow, COLORS.amberLight, COLORS.amber]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoGradientRing}
          >
            <View style={styles.logoInner}>
              <Image
                source={HomeImages.logo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.Text
          style={[
            styles.title,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleSlide }],
            },
          ]}
        >
          {i18n.t('home.headerTitle')}
        </Animated.Text>

        {/* Divider */}
        <Animated.View
          style={[
            styles.dividerContainer,
            { transform: [{ scaleX: dividerScaleX }] },
          ]}
        >
          <LinearGradient
            colors={['transparent', COLORS.amber, COLORS.amberGlow, COLORS.amber, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.dividerGradient}
          />
        </Animated.View>

        {/* Tagline */}
        <Animated.Text
          style={[
            styles.tagline,
            {
              opacity: taglineOpacity,
              transform: [{ translateY: taglineSlide }],
            },
          ]}
        >
          {i18n.t('splash.tagline')}
        </Animated.Text>
      </View>

      {/* ─── Bottom Om decorative icon ─── */}
      <Animated.View
        style={[
          styles.omContainer,
          {
            opacity: omOpacity,
            transform: [{ scale: omScale }],
          },
        ]}
      >
        <MaterialIcons name="self-improvement" size={28} color={COLORS.amber} />
      </Animated.View>

      {/* ─── Bottom decorative dots ─── */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, { width: 6, height: 6 }]} />
        <View style={[styles.dot, { width: 8, height: 8, opacity: 0.8 }]} />
        <View style={[styles.dot, { width: 10, height: 10 }]} />
        <View style={[styles.dot, { width: 8, height: 8, opacity: 0.8 }]} />
        <View style={[styles.dot, { width: 6, height: 6 }]} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  // ─── Background ───
  glowCircle: {
    position: 'absolute',
    width: width * 1.2,
    height: width * 1.2,
    borderRadius: (width * 1.2) / 2,
    backgroundColor: 'rgba(251,191,36,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(251,191,36,0.1)',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: width * 0.35,
    backgroundColor: 'rgba(255,255,255,0.12)',
    zIndex: 1,
  },
  particle: {
    position: 'absolute',
    backgroundColor: COLORS.particleGold,
    zIndex: 0,
  },
  // ─── Main content ───
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  // ─── Rings ───
  outerRing: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.5,
    borderColor: COLORS.ringOuter,
    backgroundColor: 'transparent',
  },
  innerRing: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 2,
    borderColor: COLORS.ring,
    backgroundColor: 'transparent',
  },
  // ─── Logo ───
  logoWrapper: {
    marginBottom: 36,
    shadowColor: '#B45309',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 15,
  },
  logoGradientRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoInner: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 118,
    height: 118,
    borderRadius: 59,
  },
  // ─── Typography ───
  title: {
    fontSize: 42,
    fontWeight: '800',
    color: COLORS.title,
    textAlign: 'center',
    fontFamily: fonts.regional_secondary,
    letterSpacing: 1,
    lineHeight: 52,
    textShadowColor: 'rgba(180,83,9,0.12)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 32,
  },
  dividerContainer: {
    width: 120,
    height: 3,
    marginBottom: 16,
  },
  dividerGradient: {
    flex: 1,
    borderRadius: 2,
  },
  tagline: {
    fontSize: 18,
    color: COLORS.tagline,
    textAlign: 'center',
    fontFamily: fonts.regional_secondary,
    letterSpacing: 0.5,
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.06)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    paddingHorizontal: 48,
  },
  // ─── Bottom decorative ───
  omContainer: {
    position: 'absolute',
    bottom: height * 0.12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(251,191,36,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(217,119,6,0.2)',
  },
  dotsRow: {
    position: 'absolute',
    bottom: height * 0.06,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  dot: {
    borderRadius: 50,
    backgroundColor: COLORS.amber,
    opacity: 0.5,
  },
});
