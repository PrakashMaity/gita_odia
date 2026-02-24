import { Box } from '@/components/ui/box';
import { Center } from '@/components/ui/center';
import { Text } from '@/components/ui/text';
import { useDeviceLayout } from '@/hooks/useDeviceLayout';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5 } from '@expo/vector-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { Animated } from 'react-native';

export const HeroQuote: React.FC = React.memo(() => {
  const layout = useDeviceLayout();
  const heroQuotes = i18n.t('home.heroQuotes') as string[];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const fadeAnim = useState(new Animated.Value(1))[0];
  const fonts = getLanguageFonts();
  const theme = useThemeColors();

  const heroHeight = useMemo(
    () => (layout.isTablet ? (layout.isLandscape ? 280 : 240) : 180),
    [layout.isTablet, layout.isLandscape]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuoteIndex((prev) => (prev + 1) % heroQuotes.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [heroQuotes.length, fadeAnim]);

  const currentQuote = heroQuotes[currentQuoteIndex] || heroQuotes[0];
  const quotedText = `\u201C${currentQuote}\u201D`;

  return (
    <Box
      className="mx-4 rounded-[28px] overflow-hidden border border-primary-100/60 shadow-sm justify-center relative"
      style={{ height: heroHeight, backgroundColor: theme.background.secondary }}
    >
      <Box className="absolute -left-4 -top-6 opacity-[0.05]" pointerEvents="none">
        <FontAwesome5 name="quote-left" size={140} color="#000" />
      </Box>
      <Box className="absolute -right-4 -bottom-6 opacity-[0.05]" pointerEvents="none">
        <FontAwesome5 name="om" size={180} color="#000" />
      </Box>

      <Center className="px-8 z-10">
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text
            className="text-neutral-800 text-center font-extrabold text-[18px] leading-7 tracking-tight"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {quotedText}
          </Text>
        </Animated.View>
      </Center>
    </Box>
  );
});

HeroQuote.displayName = 'HeroQuote';
