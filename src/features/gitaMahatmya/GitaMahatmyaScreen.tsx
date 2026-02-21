import { BannerAdComponent } from '@/components/ads';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MahatmyaSectionCard } from './components/MahatmyaSectionCard';

export const GitaMahatmyaScreen: React.FC = () => {
  const { width } = Dimensions.get('window');
  const mahatmyaText = i18n.t('gitaMahatmya.mahatmyaText');
  const benefits = i18n.t('gitaMahatmya.benefits') as string[];
  const { showAd, isLoaded } = useInterstitialAd();
  const adsShownCountRef = useRef<number>(0);
  const hasReachedEndRef = useRef<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    adsShownCountRef.current = 0;
    hasReachedEndRef.current = false;
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 20;
    const isAtEnd = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isAtEnd && !hasReachedEndRef.current && adsShownCountRef.current < 2 && isLoaded) {
      hasReachedEndRef.current = true;
      adsShownCountRef.current += 1;

      setTimeout(() => {
        showAd();
      }, 500);
    }

    if (!isAtEnd && hasReachedEndRef.current) {
      hasReachedEndRef.current = false;
    }
  }, [showAd, isLoaded]);

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>

      {/* Custom Modern Header */}
      <Box
        className="pb-4 px-4 border-b border-amber-900/10 shadow-sm z-10"
        style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
      >
        <HStack className="items-center justify-between">
          <Pressable
            className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70 border border-amber-100/50"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </Pressable>

          <Text
            className="text-[20px] font-black tracking-tight flex-1 text-center"
            style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
            numberOfLines={1}
          >
            {i18n.t('gitaMahatmya.title')}
          </Text>

          <Box className="w-10 h-10" />
        </HStack>
      </Box>

      {/* Main Container */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        <Box
          className="bg-white rounded-[24px] border border-amber-100/50 shadow-sm overflow-hidden mb-6"
          style={{ backgroundColor: theme.background.primary }}
        >
          <MahatmyaSectionCard
            content={i18n.t('gitaMahatmya.intro')}
            variant="intro"
          />
        </Box>

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.significanceTitle"
          content={i18n.t('gitaMahatmya.significanceText')}
        />

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.mahatmyaTitle"
          content={mahatmyaText}
          textStyle="center"
        />

        <Box className="w-full my-6 items-center flex">
          <BannerAdComponent
            adKey="gita-mahatmya-center"
          />
        </Box>

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.mahatmyaMeaningTitle"
          content={i18n.t('gitaMahatmya.mahatmyaMeaningText')}
        />

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.benefitsTitle"
          content={benefits}
          isList
        />

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.readingBenefitsTitle"
          content={i18n.t('gitaMahatmya.readingBenefitsText')}
        />

        <Box className="w-full my-6 items-center flex">
          <BannerAdComponent
            adKey="gita-mahatmya-below-center"
          />
        </Box>

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.historicalContextTitle"
          content={i18n.t('gitaMahatmya.historicalContextText')}
        />

        <MahatmyaSectionCard
          titleKey="gitaMahatmya.spiritualSignificanceTitle"
          content={i18n.t('gitaMahatmya.spiritualSignificanceText')}
        />

      </ScrollView>
    </Box>
  );
};
