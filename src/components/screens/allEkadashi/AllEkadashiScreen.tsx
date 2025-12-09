import { PageHeader } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { WavePattern } from '@/illustration/cardBackground';
import { LayoutImages } from '@/utils/assets';
import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import { styles } from './AllEkadashiScreen.styles';

type EkadashiItem = {
  name: string;
  englishDate?: string;
  bengaliDate?: string;
  description?: string;
  benefits?: string[];
  dateTimestamp?: number;
};

export const AllEkadashiScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const theme = useThemeColors();
  const params = useLocalSearchParams();
  const [selectedYear, setSelectedYear] = useState<string>(params.year as string || '1432');
  
  // Get ekadashi data for the selected year
  const getEkadashiDataForYear = (year: string): EkadashiItem[] => {
    try {
      // Try to get the year-specific data
      const allEkadashiData = i18n.t('allEkadashi') as any;
      const yearsData = allEkadashiData?.years;
      if (yearsData && yearsData[year]) {
        return (yearsData[year].ekadashiList || []) as EkadashiItem[];
      }
      // Fallback: try direct access
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
    const upcoming = ekadashiList.find((ekadashi, index) => {
      if (!ekadashi.dateTimestamp) return false;
      return ekadashi.dateTimestamp >= now;
    });
    
    if (upcoming) {
      const index = ekadashiList.findIndex(e => e.name === upcoming.name);
      return { upcomingEkadashi: upcoming, upcomingIndex: index };
    }
    
    // If no upcoming found, return the first one (next year)
    return { upcomingEkadashi: ekadashiList[0], upcomingIndex: 0 };
  }, [ekadashiList]);

  return (
    <ImageBackground
      source={LayoutImages.background3}
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <WavePattern width={width} height={height} />
        
        <PageHeader title={`${i18n.t('menu.allEkadashi')} ${selectedYear}`} />

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Year Selection Card */}
          <ThemedCard style={styles.yearSelectorCard}>
            <ThemedLanguageText 
              variant="primary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.yearLabel}
            >
              বছর নির্বাচন করুন:
            </ThemedLanguageText>
            <View style={styles.yearInputContainer}>
             
              <View style={styles.yearButtonsContainer}>
                {['1432', '1433', '1434', '1435'].map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => {
                      setSelectedYear(year);
                      router.setParams({ year });
                    }}
                    style={[
                      styles.yearButton,
                      {
                        backgroundColor: selectedYear === year 
                          ? theme.background.tertiary 
                          : theme.background.secondary,
                        borderColor: selectedYear === year 
                          ? theme.border.primary 
                          : theme.border.secondary,
                      }
                    ]}
                  >
                    <ThemedLanguageText 
                      variant={selectedYear === year ? 'primary' : 'secondary'}
                      size="small"
                      fontFamily="regional_secondary"
                      style={styles.yearButtonText}
                    >
                      {year}
                    </ThemedLanguageText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ThemedCard>

          <ThemedCard style={styles.introCard}>
            <ThemedLanguageText 
              variant="primary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.introText}
            >
              {i18n.t('allEkadashi.intro')}
            </ThemedLanguageText>
          </ThemedCard>

          {/* Upcoming Ekadashi Card */}
          {upcomingEkadashi && (
            <ThemedCard 
              style={[
                styles.upcomingCard, 
                { 
                  borderColor: theme.border.primary,
                  backgroundColor: theme.background.quaternary,
                }
              ]}
            >
              <ThemedLanguageText 
                variant="primary"
                size="large"
                fontFamily="regional_secondary"
                style={styles.upcomingTitle}
              >
                {i18n.t('allEkadashi.upcomingTitle')}
              </ThemedLanguageText>
              <ThemedLanguageText 
                variant="primary"
                size="xl"
                fontFamily="regional_secondary"
                style={styles.upcomingName}
              >
                {upcomingEkadashi.name}
              </ThemedLanguageText>
              {upcomingEkadashi.englishDate && (
                <View style={styles.dateRow}>
                  <ThemedLanguageText 
                    variant="secondary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.dateLabel}
                  >
                    {i18n.t('allEkadashi.englishDateLabel')}:
                  </ThemedLanguageText>
                  <ThemedLanguageText 
                    variant="primary"
                    size="medium"
                    fontFamily="regional_secondary"
                    style={styles.dateValue}
                  >
                    {upcomingEkadashi.englishDate}
                  </ThemedLanguageText>
                </View>
              )}
              {upcomingEkadashi.bengaliDate && (
                <View style={styles.dateRow}>
                  <ThemedLanguageText 
                    variant="secondary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.dateLabel}
                  >
                    {i18n.t('allEkadashi.bengaliDateLabel')}:
                  </ThemedLanguageText>
                  <ThemedLanguageText 
                    variant="primary"
                    size="medium"
                    fontFamily="regional_secondary"
                    style={styles.dateValue}
                  >
                    {upcomingEkadashi.bengaliDate}
                  </ThemedLanguageText>
                </View>
              )}
              {upcomingEkadashi.description && (
                <ThemedLanguageText 
                  variant="secondary"
                  size="medium"
                  fontFamily="regional_secondary"
                  style={styles.upcomingDescription}
                >
                  {upcomingEkadashi.description}
                </ThemedLanguageText>
              )}
            </ThemedCard>
          )}

          <ThemedCard style={styles.significanceCard}>
            <ThemedLanguageText 
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('allEkadashi.significanceTitle')}
            </ThemedLanguageText>
            <ThemedLanguageText 
              variant="secondary"
              size="medium"
              fontFamily="regional_secondary"
              style={styles.sectionText}
            >
              {i18n.t('allEkadashi.significanceText')}
            </ThemedLanguageText>
          </ThemedCard>

          <ThemedCard style={styles.listCard}>
            <ThemedLanguageText 
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.listTitle}
            >
              {i18n.t('allEkadashi.listTitle')}
            </ThemedLanguageText>
            
            <View style={styles.ekadashiList}>
              {ekadashiList.map((ekadashi, index) => {
                const isUpcoming = index === upcomingIndex;
                return (
                  <ThemedCard 
                    key={index}
                    style={[
                      styles.ekadashiItem, 
                      { 
                        borderColor: isUpcoming ? theme.border.primary : theme.border.secondary,
                        borderWidth: isUpcoming ? 2 : 1,
                        backgroundColor: isUpcoming ? theme.background.quaternary : undefined,
                      }
                    ]}
                  >
                    <View style={styles.ekadashiHeader}>
                      <ThemedView 
                        style={[
                          styles.numberBadge, 
                          { 
                            backgroundColor: isUpcoming ? theme.background.tertiary : theme.background.tertiary,
                          }
                        ]}
                      >
                        <ThemedLanguageText 
                          variant="primary"
                          size="small"
                          fontFamily="regional_secondary"
                          style={styles.numberText}
                        >
                          {index + 1}
                        </ThemedLanguageText>
                      </ThemedView>
                      <ThemedLanguageText 
                        variant="primary"
                        size="large"
                        fontFamily="regional_secondary"
                        style={styles.ekadashiName}
                      >
                        {ekadashi.name}
                        {isUpcoming && (
                          <ThemedLanguageText 
                            variant="tertiary"
                            size="small"
                            fontFamily="regional_secondary"
                            style={styles.upcomingBadge}
                          >
                            {' '}({i18n.t('allEkadashi.upcomingSubtitle')})
                          </ThemedLanguageText>
                        )}
                      </ThemedLanguageText>
                    </View>
                    
                    {/* Dates */}
                    {(ekadashi.englishDate || ekadashi.bengaliDate) && (
                      <View style={styles.datesContainer}>
                        {ekadashi.englishDate && (
                          <View style={styles.dateRow}>
                            <ThemedLanguageText 
                              variant="secondary"
                              size="small"
                              fontFamily="regional_secondary"
                              style={styles.dateLabel}
                            >
                              {i18n.t('allEkadashi.englishDateLabel')}:
                            </ThemedLanguageText>
                            <ThemedLanguageText 
                              variant="primary"
                              size="small"
                              fontFamily="regional_secondary"
                              style={styles.dateValue}
                            >
                              {ekadashi.englishDate}
                            </ThemedLanguageText>
                          </View>
                        )}
                        {ekadashi.bengaliDate && (
                          <View style={styles.dateRow}>
                            <ThemedLanguageText 
                              variant="secondary"
                              size="small"
                              fontFamily="regional_secondary"
                              style={styles.dateLabel}
                            >
                              {i18n.t('allEkadashi.bengaliDateLabel')}:
                            </ThemedLanguageText>
                            <ThemedLanguageText 
                              variant="primary"
                              size="small"
                              fontFamily="regional_secondary"
                              style={styles.dateValue}
                            >
                              {ekadashi.bengaliDate}
                            </ThemedLanguageText>
                          </View>
                        )}
                      </View>
                    )}
                  
                    {ekadashi.description && (
                      <ThemedLanguageText 
                        variant="secondary"
                        size="medium"
                        fontFamily="regional_secondary"
                        style={styles.ekadashiDescription}
                      >
                        {ekadashi.description}
                      </ThemedLanguageText>
                    )}
                  
                  {ekadashi.benefits && ekadashi.benefits.length > 0 && (
                    <View style={styles.benefitsContainer}>
                      <ThemedLanguageText 
                        variant="primary"
                        size="small"
                        fontFamily="regional_secondary"
                        style={styles.benefitsTitle}
                      >
                        {i18n.t('allEkadashi.benefitsTitle')}:
                      </ThemedLanguageText>
                      {ekadashi.benefits.map((benefit: string, idx: number) => (
                        <ThemedLanguageText 
                          key={idx}
                          variant="secondary"
                          size="small"
                          fontFamily="regional_secondary"
                          style={styles.benefitItem}
                        >
                          • {benefit}
                        </ThemedLanguageText>
                      ))}
                    </View>
                  )}
                </ThemedCard>
                );
              })}
            </View>
          </ThemedCard>

          <ThemedCard style={styles.instructionsCard}>
            <ThemedLanguageText 
              variant="primary"
              size="large"
              fontFamily="regional_secondary"
              style={styles.sectionTitle}
            >
              {i18n.t('allEkadashi.instructionsTitle')}
            </ThemedLanguageText>
            {(i18n.t('allEkadashi.instructions') as string[]).map((instruction, index) => (
              <ThemedLanguageText 
                key={index}
                variant="secondary"
                size="medium"
                fontFamily="regional_secondary"
                style={styles.instructionItem}
              >
                {index + 1}. {instruction}
              </ThemedLanguageText>
            ))}
          </ThemedCard>
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};

