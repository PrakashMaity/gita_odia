import { getLanguageFonts } from '@/types/font.interface';
import { OnboardingSlide as OnboardingSlideType } from '@/types/screen.interface';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const fonts = getLanguageFonts();

// Slide-specific icon configs
const SLIDE_ICONS: { name: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
  { name: 'auto-stories', color: '#92400E' },   // Book — slide 1 (scripture)
  { name: 'self-improvement', color: '#92400E' }, // Meditation — slide 2 (dhyana)
  { name: 'rocket-launch', color: '#92400E' },    // Start — slide 3 (begin journey)
];

// Premium color tokens
const COLORS = {
  cardBg: 'rgba(255,255,255,0.55)',
  cardBorder: 'rgba(255,255,255,0.75)',
  title: '#1A0E0A',             // Very dark brown
  subtitle: '#92400E',          // Deep amber
  description: '#5D4037',       // Rich brown
  divider: '#D97706',           // Golden amber
  iconBadgeBg: '#FBBF24',       // Golden yellow
  iconBadgeBorder: '#F59E0B',
  imageShadow: '#B45309',
};

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
  slideIndex: number;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide, slideIndex }) => {
  // Entrance animations
  const imageScale = useRef(new Animated.Value(0.85)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(30)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(25)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const descSlide = useRef(new Animated.Value(20)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset all
    imageScale.setValue(0.85);
    imageOpacity.setValue(0);
    badgeScale.setValue(0);
    titleSlide.setValue(30);
    titleOpacity.setValue(0);
    subtitleSlide.setValue(25);
    subtitleOpacity.setValue(0);
    descSlide.setValue(20);
    descOpacity.setValue(0);

    // Staggered premium entrance
    Animated.stagger(100, [
      // Image zoom-in
      Animated.parallel([
        Animated.spring(imageScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Icon badge bounce
      Animated.spring(badgeScale, {
        toValue: 1,
        tension: 100,
        friction: 6,
        useNativeDriver: true,
      }),
      // Title
      Animated.parallel([
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 50,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle
      Animated.parallel([
        Animated.spring(subtitleSlide, {
          toValue: 0,
          tension: 50,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Description
      Animated.parallel([
        Animated.spring(descSlide, {
          toValue: 0,
          tension: 50,
          friction: 9,
          useNativeDriver: true,
        }),
        Animated.timing(descOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [slide.id]);

  const iconConfig = SLIDE_ICONS[slideIndex] || SLIDE_ICONS[0];

  return (
    <View style={styles.container}>
      {/* ─── Hero Image ─── */}
      <Animated.View
        style={[
          styles.imageWrapper,
          {
            opacity: imageOpacity,
            transform: [{ scale: imageScale }],
          },
        ]}
      >
        <View style={styles.imageContainer}>
          <Image
            source={slide.image}
            style={styles.image}
            resizeMode="cover"
          />
          {/* Bottom gradient overlay for depth */}
          <LinearGradient
            colors={['transparent', 'rgba(255,208,107,0.5)']}
            style={styles.imageGradient}
          />
        </View>
      </Animated.View>

      {/* ─── Text Card with Glassmorphism ─── */}
      <View style={styles.textCard}>
        {/* Animated icon badge */}
        <Animated.View
          style={[
            styles.iconBadge,
            { transform: [{ scale: badgeScale }] },
          ]}
        >
          <LinearGradient
            colors={['#FBBF24', '#F59E0B', '#D97706']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconBadgeGradient}
          >
            <MaterialIcons name={iconConfig.name} size={20} color="#FFFFFF" />
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
          {slide.title}
        </Animated.Text>

        {/* Subtitle */}
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
              transform: [{ translateY: subtitleSlide }],
            },
          ]}
        >
          {slide.subtitle}
        </Animated.Text>

        {/* Golden divider */}
        <View style={styles.dividerContainer}>
          <LinearGradient
            colors={['transparent', '#D97706', '#FBBF24', '#D97706', 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.divider}
          />
        </View>

        {/* Description */}
        <Animated.Text
          style={[
            styles.description,
            {
              opacity: descOpacity,
              transform: [{ translateY: descSlide }],
            },
          ]}
        >
          {slide.description}
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
  },
  // ─── Image ───
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    width: width - 48,
    height: height * 0.36,
    borderRadius: 28,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    shadowColor: COLORS.imageShadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 12,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '45%',
  },
  // ─── Text Card ───
  textCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 28,
    paddingTop: 32,
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    shadowColor: COLORS.imageShadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
    alignItems: 'center',
  },
  // ─── Icon Badge ───
  iconBadge: {
    marginBottom: 14,
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  iconBadgeGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  // ─── Typography ───
  title: {
    fontSize: 27,
    fontWeight: '800',
    color: COLORS.title,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: fonts.regional_secondary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.subtitle,
    textAlign: 'center',
    marginBottom: 14,
    fontFamily: fonts.regional_secondary,
    letterSpacing: 0.2,
  },
  dividerContainer: {
    width: '60%',
    alignItems: 'center',
    marginBottom: 14,
  },
  divider: {
    width: '100%',
    height: 2.5,
    borderRadius: 2,
  },
  description: {
    fontSize: 14,
    color: COLORS.description,
    textAlign: 'center',
    lineHeight: 23,
    fontFamily: fonts.regional_secondary,
    letterSpacing: 0.1,
  },
});
