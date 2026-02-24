import { useSemanticColors } from '@/hooks/useSemanticColors';
import { LockedCardOverlay, PageHeader, ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { WavePattern } from '@/lib/illustration/cardBackground';
import { LayoutImages } from '@/lib/utils/assets';
import { getLanguageFonts } from '@/types/font.interface';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';

type EkadashiItem = {
  name: string;
  englishDate?: string;
  bengaliDate?: string;
  description?: string;
  benefits?: string[];
  dateTimestamp?: number;
};

export const AllEkadashiScreen: React.FC = () => {
  const { colors } = useSemanticColors();
  const { width, height } = Dimensions.get('window');
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const params = useLocalSearchParams();
  const [selectedYear, setSelectedYear] = useState<string>(params.year as string || '1432');
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);

  // Get ekadashi data for the selected year
  const getEkadashiDataForYear = (year: string): EkadashiItem[] => {
    try {
      const allEkadashiData = i18n.t('allEkadashi') as any;
      const yearsData = allEkadashiData?.years;
      if (yearsData && yearsData[year]) {
        return (yearsData[year].ekadashiList || []) as EkadashiItem[];
      }
      const yearData = i18n.t(`allEkadashi.years.${year}`) as any;
      if (yearData && yearData.ekadashiList) {
        return yearData.ekadashiList as EkadashiItem[];
      }
    } catch (error) {
      console.error('Error loading ekadashi data:', error);
    }
    return [];
  };

  const ekadashiList = useMemo<EkadashiItem[]>(() => {
    return getEkadashiDataForYear(selectedYear);
  }, [selectedYear]);

  // Calculate upcoming Ekadashi
  const { upcomingEkadashi, upcomingIndex } = useMemo(() => {
    const now = Date.now();
    const upcoming = ekadashiList.find((ekadashi) => {
      if (!ekadashi.dateTimestamp) return false;
      return ekadashi.dateTimestamp >= now;
    });

    if (upcoming) {
      const index = ekadashiList.findIndex(e => e.name === upcoming.name);
      return { upcomingEkadashi: upcoming, upcomingIndex: index };
    }

    return { upcomingEkadashi: ekadashiList[0], upcomingIndex: 0 };
  }, [ekadashiList]);

  return (
    <ImageBackground
      source={LayoutImages.background3}
      className="flex-1"
      resizeMode="cover"
      blurRadius={1.5}
    >
      <Box className="flex-1" style={{ backgroundColor: theme.background.secondary + '80' }}>
        <WavePattern width={width} height={height} />

        <PageHeader title={i18n.t('menu.allEkadashi')} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 64 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="px-4" space="lg">

            {/* Year Selection - Subtle & Professional */}
            <Box
              className="bg-white rounded-[28px] p-2 border border-primary-100 shadow-sm"
              style={{ backgroundColor: theme.background.primary }}
            >
              <HStack space="xs">
                {['1432', '1433', '1434', '1435'].map((year) => {
                  const isActive = selectedYear === year;
                  return (
                    <Pressable
                      key={year}
                      onPress={() => {
                        setSelectedYear(year);
                        router.setParams({ year });
                      }}
                      className={`flex-1 items-center justify-center py-2.5 rounded-[20px] ${isActive ? 'bg-primary-50' : 'bg-transparent'
                        }`}
                    >
                      <Text
                        className={`text-[14px] font-bold ${isActive ? 'text-primary-800' : 'text-neutral-400'
                          }`}
                        style={{ fontFamily: fonts.regional_secondary }}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  );
                })}
              </HStack>
            </Box>

            {/* Premium Hero section for Upcoming Ekadashi */}
            {upcomingEkadashi && (
              <Box
                className="rounded-[32px] p-6 border border-primary-200/50 shadow-md relative overflow-hidden"
                style={{ backgroundColor: theme.background.primary }}
              >
                <Box className="absolute -bottom-6 -right-6 opacity-[0.04]" pointerEvents="none">
                  <MaterialIcons name="event-available" size={140} color="#000" />
                </Box>

                <HStack className="items-center mb-4" space="sm">
                  <Box className="w-10 h-10 bg-primary-50 rounded-[16px] items-center justify-center">
                    <FontAwesome5 name="star" size={16} color={colors.primary600} />
                  </Box>
                  <Text
                    className="text-primary-800 font-extrabold text-[12px] uppercase tracking-widest"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('allEkadashi.upcomingTitle')}
                  </Text>
                </HStack>

                <Heading
                  className="text-neutral-900 text-3xl font-extrabold tracking-tight mb-4"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {upcomingEkadashi.name}
                </Heading>

                <VStack space="sm" className="mb-2">
                  <HStack className="items-center" space="xs">
                    <Feather name="calendar" size={14} color={colors.primary600} />
                    <Text
                      className="text-neutral-500 text-sm"
                      style={{ fontFamily: fonts.regional_secondary }}
                    >
                      {upcomingEkadashi.englishDate}
                    </Text>
                  </HStack>
                  <HStack className="items-center" space="xs">
                    <Feather name="clock" size={14} color={colors.primary600} />
                    <Text
                      className="text-neutral-500 text-sm"
                      style={{ fontFamily: fonts.regional_secondary }}
                    >
                      {upcomingEkadashi.bengaliDate}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            )}

            {/* Intro Text */}
            <Box
              className="rounded-[24px] p-5 border border-primary-100 shadow-sm"
              style={{ backgroundColor: theme.background.primary }}
            >
              <Text
                className="text-neutral-600 text-[15px] leading-6 italic text-center"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('allEkadashi.intro')}
              </Text>
            </Box>

            {/* List Heading */}
            <HStack className="items-center justify-between mt-4 px-1">
              <Heading
                className="text-neutral-800 text-[20px] font-extrabold tracking-tight"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('allEkadashi.listTitle')}
              </Heading>
              <Box className="flex-1 h-[1px] bg-primary-100 ml-4 opacity-50" />
            </HStack>

            {/* Ekadashi List Cards */}
            <VStack space="sm">
              {ekadashiList.map((ekadashi, index) => {
                const isUpcoming = index === upcomingIndex;
                const isLocked = !isPro && index >= 3;

                return (
                  <LockedCardOverlay
                    key={index}
                    isLocked={isLocked}
                    onPress={() => setShowProModal(true)}
                  >
                    <Box
                      className={`rounded-[24px] p-4 border shadow-sm flex-row items-center relative overflow-hidden ${isUpcoming ? 'border-primary-400' : 'border-primary-100/50'
                        }`}
                      style={{ backgroundColor: theme.background.primary }}
                    >
                      {isUpcoming && (
                        <Box className="absolute top-0 right-0 px-3 py-1 bg-primary-500 rounded-bl-[12px]">
                          <Text className="text-[10px] text-white font-black uppercase">
                            {i18n.t('allEkadashi.upcomingSubtitle')}
                          </Text>
                        </Box>
                      )}

                      {/* Index Badge */}
                      <Box
                        className={`w-10 h-10 rounded-[14px] items-center justify-center mr-4 ${isUpcoming ? 'bg-primary-100' : 'bg-neutral-50'
                          }`}
                      >
                        <Text
                          className={`text-sm font-black ${isUpcoming ? 'text-primary-800' : 'text-neutral-400'
                            }`}
                        >
                          {index + 1}
                        </Text>
                      </Box>

                      {/* Info */}
                      <VStack className="flex-1 justify-center">
                        <Text
                          className="text-neutral-800 font-extrabold text-[16px] tracking-tight mb-1"
                          style={{ fontFamily: fonts.regional_secondary }}
                          numberOfLines={1}
                        >
                          {ekadashi.name}
                        </Text>
                        <Text
                          className="text-neutral-500 text-[12px]"
                          style={{ fontFamily: fonts.regional_secondary }}
                        >
                          {ekadashi.englishDate} • {ekadashi.bengaliDate}
                        </Text>
                      </VStack>

                      {/* Action Icon */}
                      <Box className="w-8 h-8 rounded-full items-center justify-center bg-primary-50/50">
                        <MaterialIcons
                          name="arrow-forward-ios"
                          size={12}
                          color={isUpcoming ? colors.primary600 : "#D1D5DB"}
                        />
                      </Box>
                    </Box>
                  </LockedCardOverlay>
                );
              })}
            </VStack>

            {/* Significance & Instructions */}
            <VStack space="md" className="mt-6">
              <Box
                className="rounded-[28px] p-6 border border-primary-100 shadow-sm relative overflow-hidden"
                style={{ backgroundColor: theme.background.primary }}
              >
                <Box className="absolute -bottom-4 -right-4 opacity-[0.03]" pointerEvents="none">
                  <FontAwesome5 name="info-circle" size={100} color="#000" />
                </Box>
                <Heading
                  className="text-neutral-800 font-extrabold text-[18px] mb-3"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('allEkadashi.significanceTitle')}
                </Heading>
                <Text
                  className="text-neutral-500 text-[14px] leading-6"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('allEkadashi.significanceText')}
                </Text>
              </Box>

              <Box
                className="rounded-[28px] p-6 border border-primary-100 shadow-sm relative overflow-hidden mb-8"
                style={{ backgroundColor: theme.background.primary }}
              >
                <Heading
                  className="text-neutral-800 font-extrabold text-[18px] mb-4"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('allEkadashi.instructionsTitle')}
                </Heading>
                <VStack space="md">
                  {(i18n.t('allEkadashi.instructions') as string[]).map((instruction, index) => (
                    <HStack key={index} space="sm" className="items-start">
                      <Text className="text-primary-600 font-black mt-1">•</Text>
                      <Text
                        className="flex-1 text-neutral-500 text-sm leading-6"
                        style={{ fontFamily: fonts.regional_secondary }}
                      >
                        {instruction}
                      </Text>
                    </HStack>
                  ))}
                </VStack>
              </Box>
            </VStack>

          </VStack>
        </ScrollView>
        <ProUpgradeModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
        />
      </Box>
    </ImageBackground>
  );
};

export default AllEkadashiScreen;
