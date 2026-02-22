import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useThemeColors } from '@/hooks/useTheme';
import { SIZES } from '@/rootconstants/sizes';
import { colors } from '@/rootconstants/tint';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const BAR_MAX_HEIGHT = 100;

interface WeeklyChartProps {
  data: { date: string; versesRead: number }[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const theme = useThemeColors();
  const maxVerses = Math.max(...data.map(d => d.versesRead), 1);

  const getDayLabel = (date: string) => {
    const d = new Date(date);
    const days = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহস্পতি', 'শুক্র', 'শনি'];
    return days[d.getDay()];
  };

  return (
    <ThemedCard variant="card" style={styles.container}>
      <View style={styles.header}>
        <ThemedLanguageText
          variant="primary"
          size="large"
          style={styles.title}
          fontFamily="regional_secondary"
        >
          সপ্তাহের পরিসংখ্যান
        </ThemedLanguageText>
      </View>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.versesRead / maxVerses) * BAR_MAX_HEIGHT;
          const hasValue = item.versesRead > 0;
          
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: hasValue ? Math.max(barHeight, 4) : 4,
                      backgroundColor: hasValue ? colors.primary500 : theme.background.tertiary,
                    },
                  ]}
                />
              </View>
              <ThemedLanguageText
                variant="secondary"
                size="small"
                style={styles.dayLabel}
                fontFamily="regional_secondary"
              >
                {getDayLabel(item.date)}
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="secondary"
                size="small"
                style={styles.valueLabel}
                fontFamily="regional_secondary"
              >
                {item.versesRead}
              </ThemedLanguageText>
            </View>
          );
        })}
      </View>
    </ThemedCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: BAR_MAX_HEIGHT + 60,
    paddingHorizontal: SIZES.spacing.xs,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  barWrapper: {
    width: '80%',
    height: BAR_MAX_HEIGHT,
    justifyContent: 'flex-end',
    marginBottom: SIZES.spacing.xs,
    alignItems: 'center',
  },
  bar: {
    width: '100%',
    minHeight: 4,
    borderRadius: 4,
  },
  dayLabel: {
    fontSize: 11,
    marginTop: SIZES.spacing.xs,
    textAlign: 'center',
    fontWeight: '500',
  },
  valueLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
    opacity: 0.8,
  },
});
