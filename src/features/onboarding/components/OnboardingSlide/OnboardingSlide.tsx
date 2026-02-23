import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { OnboardingSlide as OnboardingSlideType } from '@/types/screen.interface';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, Image } from 'react-native';

const { height } = Dimensions.get('window');

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({ slide }) => {
  return (
    <>
      <Box className="mx-6 mt-6 mb-4">
        <Box
          className="relative rounded-2xl overflow-hidden"
          style={{ height: height * 0.4 }}
        >
          <Image
            source={slide.image}
            className="w-full h-full"
            resizeMode="cover"
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.3)']}
            className="absolute bottom-0 left-0 right-0 h-1/2"
          />
        </Box>
      </Box>

      <Box className="mx-6 mt-2 bg-neutral-900 rounded-2xl border border-neutral-800 p-6">
        <Box className="items-center">
          <Text className="text-white text-2xl font-bold text-center mb-2 font-regional_secondary">
            {slide.title}
          </Text>

          <Text className="text-white text-xl font-semibold text-center mb-6 opacity-90 font-regional_secondary">
            {slide.subtitle}
          </Text>

          <Text className="text-neutral-400 text-base text-center leading-6 opacity-80 font-regional_secondary">
            {slide.description}
          </Text>
        </Box>
      </Box>
    </>
  );
};

