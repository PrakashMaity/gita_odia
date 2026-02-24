import { useSemanticColors } from '@/hooks/useSemanticColors';
import { LockedCardOverlay, ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useProStatus } from '@/hooks/useProStatus';
import { useRewardedInterstitialAd } from '@/hooks/useRewardedInterstitialAd';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MangalacharanSectionCard } from '../mangalacharan/components/MangalacharanSectionCard';

export const KrishnaMantrasScreen: React.FC = () => {
  const { colors, rgba } = useSemanticColors();
  const mantras = i18n.t('krishnaMantras.mantras') as any;
  const { showAd, isLoaded } = useInterstitialAd();
  const { showAd: showRewardedInterstitialAd, isLoaded: isRewardedLoaded } = useRewardedInterstitialAd();
  const triggeredMilestonesRef = useRef<Set<'mid' | 'deep' | 'end'>>(new Set());
  const scrollViewRef = useRef<ScrollView>(null);
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);
  const fonts = getLanguageFonts();
  const theme = useThemeColors();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    triggeredMilestonesRef.current.clear();
  }, []);

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      if (!contentSize.height) return;

      const progress = (contentOffset.y + layoutMeasurement.height) / contentSize.height;

      if (progress >= 0.45 && !triggeredMilestonesRef.current.has('mid') && isLoaded) {
        triggeredMilestonesRef.current.add('mid');
        setTimeout(() => showAd(), 500);
      }

      if (progress >= 0.72 && !triggeredMilestonesRef.current.has('deep')) {
        triggeredMilestonesRef.current.add('deep');
        setTimeout(() => {
          if (isRewardedLoaded) {
            showRewardedInterstitialAd();
          } else if (isLoaded) {
            showAd();
          }
        }, 500);
      }

      if (progress >= 0.95 && !triggeredMilestonesRef.current.has('end') && isLoaded) {
        triggeredMilestonesRef.current.add('end');
        setTimeout(() => showAd(), 500);
      }
    },
    [showAd, isLoaded, showRewardedInterstitialAd, isRewardedLoaded]
  );

  return (
    <Box className="flex-1" style={{ backgroundColor: theme.background.secondary }}>
      {/* Custom Modern Header */}
      <Box
        className="pb-4 px-4 border-b border-primary-900/10 shadow-sm z-10"
        style={{ backgroundColor: theme.background.secondary, paddingTop: Math.max(insets.top, 20) }}
      >
        <HStack className="items-center justify-between">
          <Pressable
            className="w-10 h-10 bg-white/50 rounded-[14px] items-center justify-center active:opacity-70 border border-primary-100/50"
            onPress={() => router.back()}
          >
            <Ionicons name="chevron-back" size={24} color={theme.text.primary} />
          </Pressable>

          <Text
            className="text-[20px] font-black tracking-tight flex-1 text-center"
            style={{ fontFamily: fonts.regional_secondary, color: theme.text.primary }}
            numberOfLines={1}
          >
            {i18n.t('krishnaMantras.title')}
          </Text>

          <Box className="w-10 h-10" />
        </HStack>
      </Box>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 pt-6"
        contentContainerStyle={{ paddingBottom: 64 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={400}
      >
        {/* ─── Hero Intro Card ─── */}
        <Box
          className="rounded-[28px] p-6 mb-5 overflow-hidden relative border border-primary-100/40"
          style={{ backgroundColor: theme.background.primary }}
        >
          <Box className="absolute -right-8 -bottom-8 opacity-[0.04]" pointerEvents="none">
            <FontAwesome5 name="om" size={180} color="#000" />
          </Box>
          <HStack className="items-center mb-3">
            <Box
              className="w-10 h-10 rounded-[14px] items-center justify-center mr-3"
              style={{ backgroundColor: 'rgba(217,119,6,0.1)' }}
            >
              <FontAwesome5 name="hands" size={18} color={colors.primary600} />
            </Box>
            <Text
              className="text-[20px] font-black text-neutral-800 tracking-tight flex-1"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {i18n.t('krishnaMantras.title')}
            </Text>
          </HStack>
          <Text
            className="text-[15px] leading-6 text-neutral-600"
            style={{ fontFamily: fonts.regional_secondary }}
          >
            {i18n.t('krishnaMantras.intro')}
          </Text>
        </Box>

        {/* ─── Mantras ─── */}
        {Object.keys(mantras).map((mantraKey, mantraIndex) => {
          const mantra = mantras[mantraKey];
          const isFirstMantra = mantraIndex === 0;
          const isMiddleMantra =
            mantraIndex === Math.floor(Object.keys(mantras).length / 2);

          return (
            <VStack key={mantraKey}>
              {/* ─── Mantra Divider ─── */}
              {mantraIndex > 0 && (
                <HStack className="items-center my-5">
                  <Box className="h-[1px] flex-1 bg-primary-900/10" />
                  <Box
                    className="w-8 h-8 rounded-full items-center justify-center mx-3"
                    style={{ backgroundColor: 'rgba(217,119,6,0.08)' }}
                  >
                    <FontAwesome5 name="om" size={12} color={colors.primary600} />
                  </Box>
                  <Box className="h-[1px] flex-1 bg-primary-900/10" />
                </HStack>
              )}

              {isFirstMantra && (
                <>
                  <MangalacharanSectionCard
                    titleKey={`krishnaMantras.mantras.${mantraKey}.name`}
                    content={mantra.mantraText}
                    textStyle="center"
                  />
                </>
              )}

              {!isFirstMantra && (
                <MangalacharanSectionCard
                  titleKey={`krishnaMantras.mantras.${mantraKey}.name`}
                  content={mantra.mantraText}
                  textStyle="center"
                />
              )}

              <MangalacharanSectionCard
                titleKey="krishnaMantras.meaningTitle"
                content={mantra.meaning}
              />

              {!isFirstMantra && (
                <>
                  <LockedCardOverlay
                    isLocked={!isPro}
                    onPress={() => setShowProModal(true)}
                  >
                    <MangalacharanSectionCard
                      titleKey="krishnaMantras.niyomTitle"
                      content={mantra.niyom}
                      isList
                    />
                  </LockedCardOverlay>

                  <LockedCardOverlay
                    isLocked={!isPro}
                    onPress={() => setShowProModal(true)}
                  >
                    <MangalacharanSectionCard
                      titleKey="krishnaMantras.podhotiTitle"
                      content={mantra.podhoti}
                      isList
                    />
                  </LockedCardOverlay>

                  {mantra.benefits && (
                    <LockedCardOverlay
                      isLocked={!isPro}
                      onPress={() => setShowProModal(true)}
                    >
                      <MangalacharanSectionCard
                        titleKey="krishnaMantras.benefitsTitle"
                        content={mantra.benefits}
                        isList
                      />
                    </LockedCardOverlay>
                  )}
                </>
              )}

              {isFirstMantra && (
                <>
                  <MangalacharanSectionCard
                    titleKey="krishnaMantras.niyomTitle"
                    content={mantra.niyom}
                    isList
                  />

                  <MangalacharanSectionCard
                    titleKey="krishnaMantras.podhotiTitle"
                    content={mantra.podhoti}
                    isList
                  />

                  {mantra.benefits && (
                    <MangalacharanSectionCard
                      titleKey="krishnaMantras.benefitsTitle"
                      content={mantra.benefits}
                      isList
                    />
                  )}
                </>
              )}

              {isMiddleMantra && <Box className="my-1" />}
            </VStack>
          );
        })}

        {/* Bottom spacing */}
        <Box className="h-8" />
      </ScrollView>

      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Box>
  );
};
