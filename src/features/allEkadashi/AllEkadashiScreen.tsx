import { LockedCardOverlay, PageHeader, ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useProStatus } from '@/hooks/useProStatus';
import { useSemanticColors } from '@/hooks/useSemanticColors';
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
  description?: string;
  benefits?: string[];
  dateTimestamp?: number;
};

export const AllEkadashiScreen: React.FC = () => {
  const { colors } = useSemanticColors();
  const { width, height } = Dimensions.get('window');
  const fonts = getLanguageFonts();
  const params = useLocalSearchParams();
  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);

  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState<string>(params.year as string || currentYear);

  const yearTabs = useMemo(() => {
    const baseYear = parseInt(currentYear);
    return [
      baseYear.toString(),
      (baseYear + 1).toString(),
      (baseYear + 2).toString(),
      (baseYear + 3).toString(),
    ];
  }, [currentYear]);

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

  // Calculate upcoming Ekadashi based on start of day
  const { upcomingEkadashi, upcomingIndex } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to midnight to cover the whole current day
    const now = today.getTime();

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
      <Box className="flex-1 bg-background-light/90 dark:bg-background-dark/90">
        <WavePattern width={width} height={height} />

        <PageHeader title={i18n.t('menu.allEkadashi')} />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 64 }}
          showsVerticalScrollIndicator={false}
        >
          <VStack className="px-5 pt-2" space="xl">

            {/* Year Selection - Sleek Segmented Control */}
            <Box className="bg-background-0 dark:bg-secondary-900 rounded-full p-1.5 shadow-sm border border-primary-100 dark:border-secondary-800">
              <HStack space="xs">
                {yearTabs.map((year) => {
                  const isActive = selectedYear === year;
                  return (
                    <Pressable
                      key={year}
                      onPress={() => {
                        setSelectedYear(year);
                        router.setParams({ year });
                      }}
                      className={`flex-1 items-center justify-center py-3 rounded-full transition-all active:opacity-70 ${isActive ? 'bg-primary-500 shadow-sm' : 'bg-transparent'
                        }`}
                    >
                      <Text
                        className={`text-[15px] font-bold tracking-wide ${isActive ? 'text-white' : 'text-typography-500 dark:text-typography-400'
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
              <Box className="rounded-[32px] p-7 border border-primary-200 shadow-hard-2 relative overflow-hidden bg-primary-50 dark:bg-secondary-900">
                <Box className="absolute -bottom-8 -right-8 opacity-10 dark:opacity-5" pointerEvents="none">
                  <MaterialIcons name="event-available" size={160} color={colors.primary600} />
                </Box>

                <HStack className="items-center mb-5" space="sm">
                  <Box className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-2xl items-center justify-center shadow-soft-1">
                    <FontAwesome5 name="star" size={16} color={colors.primary600} />
                  </Box>
                  <Text
                    className="text-primary-800 dark:text-primary-300 font-extrabold text-[13px] uppercase tracking-[0.2em]"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('allEkadashi.upcomingTitle')}
                  </Text>
                </HStack>

                <Heading
                  className="text-primary-950 dark:text-white text-[32px] leading-[38px] font-extrablack tracking-tight mb-5"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {upcomingEkadashi.name}
                </Heading>

                <VStack space="sm" className="mb-2">
                  <HStack className="items-center" space="md">
                    <Box className="w-8 h-8 rounded-full bg-white dark:bg-secondary-800 items-center justify-center shadow-sm">
                      <Feather name="calendar" size={14} color={colors.primary600} />
                    </Box>
                    <Text
                      className="text-typography-700 dark:text-typography-300 text-[15px] font-medium"
                      style={{ fontFamily: fonts.regional_secondary }}
                    >
                      {upcomingEkadashi.englishDate}
                    </Text>
                  </HStack>
                </VStack>
              </Box>
            )}

            {/* Intro Text */}
            <Box className="rounded-3xl p-6 border border-outline-100 dark:border-outline-800 shadow-soft-1 bg-background-0 dark:bg-secondary-900">
              <Text
                className="text-typography-600 dark:text-typography-400 text-[15.5px] leading-[26px] italic text-center"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                &quot;{i18n.t('allEkadashi.intro')}&quot;
              </Text>
            </Box>

            {/* List Heading */}
            <HStack className="items-center justify-between mt-2 px-2">
              <Heading
                className="text-typography-900 dark:text-white text-[22px] font-extrablack tracking-tight"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('allEkadashi.listTitle')}
              </Heading>
              <Box className="flex-1 h-[2px] bg-primary-100 dark:bg-secondary-800 ml-5 rounded-full" />
            </HStack>

            {/* Ekadashi List Cards */}
            <VStack space="md">
              {ekadashiList.map((ekadashi, index) => {
                const isUpcoming = index === upcomingIndex;
                const isLocked = !isPro && index >= 3;

                return (
                  <LockedCardOverlay
                    key={index}
                    isLocked={isLocked}
                    onPress={() => setShowProModal(true)}
                  >
                    <Pressable
                      className={`rounded-3xl p-5 border shadow-soft-1 flex-row items-center relative overflow-hidden transition-all active:opacity-80 active:scale-[0.98] ${isUpcoming ? 'border-primary-400 bg-primary-50 dark:bg-secondary-800' : 'border-outline-100 dark:border-outline-800 bg-background-0 dark:bg-secondary-900'
                        }`}
                      onPress={() => {
                        if (isLocked) setShowProModal(true);
                      }}
                    >
                      {isUpcoming && (
                        <Box className="absolute top-0 right-0 px-4 py-1.5 bg-primary-500 rounded-bl-2xl shadow-sm">
                          <Text className="text-[10px] text-white font-black uppercase tracking-wider">
                            {i18n.t('allEkadashi.upcomingSubtitle')}
                          </Text>
                        </Box>
                      )}

                      {/* Index Badge */}
                      <Box
                        className={`w-12 h-12 rounded-2xl items-center justify-center mr-5 shadow-sm ${isUpcoming ? 'bg-primary-100 dark:bg-primary-900' : 'bg-background-50 dark:bg-secondary-800'
                          }`}
                      >
                        <Text
                          className={`text-[16px] font-extrablack ${isUpcoming ? 'text-primary-800 dark:text-primary-300' : 'text-typography-500 dark:text-typography-400'
                            }`}
                        >
                          {index + 1}
                        </Text>
                      </Box>

                      {/* Info */}
                      <VStack className="flex-1 justify-center pr-2">
                        <Text
                          className="text-typography-900 dark:text-white font-extrablack text-[17px] tracking-tight mb-1.5"
                          style={{ fontFamily: fonts.regional_secondary }}
                          numberOfLines={1}
                        >
                          {ekadashi.name}
                        </Text>
                        <HStack className="items-center" space="xs">
                          <Feather name="calendar" size={12} color={isUpcoming ? colors.primary600 : "#9CA3AF"} />
                          <Text
                            className="text-typography-500 dark:text-typography-400 text-[13px] font-medium"
                            style={{ fontFamily: fonts.regional_secondary }}
                          >
                            {ekadashi.englishDate}
                          </Text>
                        </HStack>
                      </VStack>

                      {/* Action Icon */}
                      <Box className={`w-9 h-9 rounded-full items-center justify-center ${isUpcoming ? 'bg-primary-100 dark:bg-primary-900' : 'bg-background-50 dark:bg-secondary-800'
                        }`}>
                        <MaterialIcons
                          name="arrow-forward-ios"
                          size={12}
                          color={isUpcoming ? colors.primary600 : "#9CA3AF"}
                        />
                      </Box>
                    </Pressable>
                  </LockedCardOverlay>
                );
              })}
            </VStack>

            {/* Significance & Instructions */}
            <VStack space="lg" className="mt-8">
              <Box className="rounded-3xl p-7 border border-primary-100 dark:border-secondary-800 shadow-soft-2 relative overflow-hidden bg-background-0 dark:bg-secondary-900">
                <Box className="absolute -bottom-6 -right-6 opacity-5 dark:opacity-10" pointerEvents="none">
                  <FontAwesome5 name="om" size={120} color={colors.primary600} />
                </Box>
                <Heading
                  className="text-primary-900 dark:text-primary-300 font-extrablack text-[20px] mb-4"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('allEkadashi.significanceTitle')}
                </Heading>
                <Text
                  className="text-typography-600 dark:text-typography-300 text-[15px] leading-[26px]"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('allEkadashi.significanceText')}
                </Text>
              </Box>

              <Box className="rounded-3xl p-7 border border-outline-100 dark:border-outline-800 shadow-soft-1 relative overflow-hidden mb-10 bg-background-0 dark:bg-secondary-900">
                <Heading
                  className="text-typography-900 dark:text-white font-extrablack text-[20px] mb-6"
                  style={{ fontFamily: fonts.regional_secondary }}
                >
                  {i18n.t('allEkadashi.instructionsTitle')}
                </Heading>
                <VStack space="lg">
                  {(i18n.t('allEkadashi.instructions') as string[]).map((instruction, index) => (
                    <HStack key={index} space="md" className="items-start">
                      <Box className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mt-0.5">
                        <Text className="text-primary-700 dark:text-primary-300 font-black text-[10px]">{index + 1}</Text>
                      </Box>
                      <Text
                        className="flex-1 text-typography-600 dark:text-typography-300 text-[15px] leading-[26px]"
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
