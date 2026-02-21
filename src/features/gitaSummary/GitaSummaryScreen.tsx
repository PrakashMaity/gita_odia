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
import { ConclusionCard } from './components/ConclusionCard';
import { SectionCard } from './components/SectionCard';
import { SummaryCard } from './components/SummaryCard';
import { useGitaSummaryData } from './hooks/useGitaSummaryData';

export const GitaSummaryScreen: React.FC = () => {
  const { width } = Dimensions.get('window');
  const { summaryData, teachings } = useGitaSummaryData();
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
            {i18n.t('gitaSummary.title')}
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

        {/* Intro */}
        <Box
          className="bg-white rounded-[24px] border border-amber-100/50 shadow-sm overflow-hidden mb-6"
          style={{ backgroundColor: theme.background.primary }}
        >
          <SectionCard
            content={i18n.t('gitaSummary.intro')}
            variant="intro"
          />
        </Box>

        <SectionCard
          titleKey="gitaSummary.significanceTitle"
          content={i18n.t('gitaSummary.significanceText')}
        />

        <SectionCard
          titleKey="gitaSummary.structureTitle"
          content={i18n.t('gitaSummary.structureText')}
        />

        <Box className="w-full my-6 items-center flex">
          <BannerAdComponent
            adKey="gita-summary-center"
          />
        </Box>

        <SectionCard
          titleKey="gitaSummary.importanceTitle"
          content={i18n.t('gitaSummary.importanceText')}
        />

        <Box className="mt-2 mb-6">
          {summaryData.map((item, index) => (
            <SummaryCard
              key={index}
              chapter={item.chapter}
              title={item.title}
              summary={item.summary}
            />
          ))}
        </Box>

        <Box className="w-full my-6 items-center flex">
          <BannerAdComponent
            adKey="gita-summary-below-center"
          />
        </Box>

        <ConclusionCard
          titleKey="gitaSummary.teachingsTitle"
          teachings={teachings}
        />

      </ScrollView>
    </Box>
  );
};
