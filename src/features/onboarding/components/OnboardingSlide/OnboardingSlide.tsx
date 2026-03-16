import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { getLanguageFonts } from '@/types/font.interface';
import { OnboardingSlide as OnboardingSlideType } from '@/types/screen.interface';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, Platform, ScrollView } from 'react-native';

const { height } = Dimensions.get('window');
const fonts = getLanguageFonts();

// Slide-specific icon configs
const SLIDE_ICONS: { name: keyof typeof MaterialIcons.glyphMap; color: string }[] = [
  { name: 'auto-stories', color: '#92400E' },   // Book — slide 1 (scripture)
  { name: 'self-improvement', color: '#92400E' }, // Meditation — slide 2 (dhyana)
  { name: 'rocket-launch', color: '#92400E' },    // Start — slide 3 (begin journey)
];

// Premium color tokens
const COLORS = {
  title: '#1A0E0A',             // Very dark brown
  subtitle: '#92400E',          // Deep amber
  description: '#5D4037',       // Rich brown
  divider: '#D97706',           // Golden amber
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
      Animated.parallel([
        Animated.spring(imageScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
        Animated.timing(imageOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.spring(badgeScale, { toValue: 1, tension: 100, friction: 6, useNativeDriver: true }),
      Animated.parallel([
        Animated.spring(titleSlide, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
        Animated.timing(titleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(subtitleSlide, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
        Animated.timing(subtitleOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.spring(descSlide, { toValue: 0, tension: 50, friction: 9, useNativeDriver: true }),
        Animated.timing(descOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, [slide.id]);

  const iconConfig = SLIDE_ICONS[slideIndex] || SLIDE_ICONS[0];

  return (
    <Box className="flex-1 w-full px-6 py-2 pb-6 justify-center">
      {/* ─── Hero Image ─── */}
      <Animated.View
        className="flex-1 items-center justify-center min-h-[40%] w-full"
        style={{
          opacity: imageOpacity,
          transform: [{ scale: imageScale }],
          zIndex: 1,
        }}
      >
        <Box
          className="w-full aspect-[4/3] max-h-[340px] rounded-[28px] overflow-hidden bg-white/30 border-2 border-white/60"
          style={{
            shadowColor: COLORS.imageShadow,
            shadowOffset: { width: 0, height: 10 },
            shadowOpacity: 0.3,
            shadowRadius: 20,
            elevation: 12,
          }}
        >
          <Image
            source={slide.image}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(255,208,107,0.5)']}
            className="absolute bottom-0 left-0 right-0 h-[45%]"
          />
        </Box>
      </Animated.View>

      {/* ─── Text Card with Glassmorphism ─── */}
      <Box
        className="w-full bg-white/55 rounded-[28px] border border-white/75 shrink mt-6 overflow-hidden max-h-[50%]"
        style={{
          shadowColor: COLORS.imageShadow,
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: Platform.OS === 'ios' ? 0.12 : 0.4,
          shadowRadius: 16,
          elevation: 6,
          zIndex: 2,
        }}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32, flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={true}
        >
          {/* Animated icon badge */}
          {/* <Animated.View
            className="mb-3.5 z-10"
            style={{
              transform: [{ scale: badgeScale }],
              shadowColor: '#D97706',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: Platform.OS === 'ios' ? 0.4 : 0.8,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <LinearGradient
              colors={['#FBBF24', '#F59E0B', '#D97706']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="w-12 h-12 rounded-full items-center justify-center border-2 border-white/50"
            >
              <MaterialIcons name={iconConfig.name} size={20} color="#FFFFFF" />
            </LinearGradient>
          </Animated.View> */}

          {/* Title and Content */}
          <VStack space="md" className="w-full items-center">
            {/* Title */}
            <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleSlide }] }}>
              <Text
                className="text-[27px] font-extrabold text-center tracking-tight"
                style={{ fontFamily: fonts.regional_secondary, color: COLORS.title }}
              >
                {slide.title}
              </Text>
            </Animated.View>

            {/* Subtitle */}
            <Animated.View style={{ opacity: subtitleOpacity, transform: [{ translateY: subtitleSlide }] }}>
              <Text
                className="text-[16px] font-bold text-center mb-3.5"
                style={{ fontFamily: fonts.regional_secondary, color: COLORS.subtitle }}
              >
                {slide.subtitle}
              </Text>
            </Animated.View>

            {/* Golden divider */}
            <Box className="w-[60%] items-center mb-3.5">
              <LinearGradient
                colors={['transparent', COLORS.divider, '#FBBF24', COLORS.divider, 'transparent']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full h-[2.5px] rounded-sm"
              />
            </Box>

            {/* Description */}
            <Animated.View style={{ opacity: descOpacity, transform: [{ translateY: descSlide }] }}>
              <Text
                className="text-[14px] text-center leading-6"
                style={{ fontFamily: fonts.regional_secondary, color: COLORS.description }}
              >
                {slide.description}
              </Text>
            </Animated.View>
          </VStack>
        </ScrollView>
      </Box>
    </Box>
  );
};
