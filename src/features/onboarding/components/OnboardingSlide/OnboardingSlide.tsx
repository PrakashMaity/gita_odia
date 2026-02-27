import { colors } from '@/rootconstants/tint';
import { getLanguageFonts } from '@/types/font.interface';
import { OnboardingSlide as OnboardingSlideType } from '@/types/screen.interface';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const languageFonts = getLanguageFonts();

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide }) => {
  // Entrance animations
  const imageScale = useRef(new Animated.Value(0.85)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(20)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleSlide = useRef(new Animated.Value(20)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const descSlide = useRef(new Animated.Value(20)).current;
  const descOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset
    imageScale.setValue(0.85);
    imageOpacity.setValue(0);
    titleSlide.setValue(20);
    titleOpacity.setValue(0);
    subtitleSlide.setValue(20);
    subtitleOpacity.setValue(0);
    descSlide.setValue(20);
    descOpacity.setValue(0);

    // Staggered entrance
    Animated.stagger(120, [
      // Image
      Animated.parallel([
        Animated.spring(imageScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(imageOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
      // Title
      Animated.parallel([
        Animated.spring(titleSlide, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      // Subtitle
      Animated.parallel([
        Animated.spring(subtitleSlide, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(subtitleOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
      // Description
      Animated.parallel([
        Animated.spring(descSlide, {
          toValue: 0,
          tension: 60,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(descOpacity, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [slide.id]);

  return (
    <View style={styles.container}>
      {/* Image Section */}
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
          <LinearGradient
            colors={['transparent', 'rgba(255,204,128,0.4)']}
            style={styles.imageGradient}
          />
        </View>
      </Animated.View>

      {/* Text Card */}
      <View style={styles.textCard}>
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

        <View style={styles.divider} />

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
  imageWrapper: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: width - 48,
    height: height * 0.38,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.3)',
    elevation: 8,
    shadowColor: colors.secondary200,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
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
    height: '40%',
  },
  textCard: {
    backgroundColor: 'rgba(255,255,255,0.65)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
    // Frosted glass effect
    shadowColor: colors.secondary200,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.secondary50,
    textAlign: 'center',
    marginBottom: 6,
    fontFamily: languageFonts.regional_secondary,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.secondary200,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: languageFonts.regional_secondary,
  },
  divider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.primary300,
    alignSelf: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: colors.secondary300,
    textAlign: 'center',
    lineHeight: 24,
    fontFamily: languageFonts.regional_secondary,
  },
});
