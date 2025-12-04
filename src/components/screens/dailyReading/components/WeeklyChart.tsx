import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useThemeColors } from '@/hooks/useTheme';

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - SIZES.spacing.lg * 2;
const BAR_MAX_HEIGHT = 120;

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
    <ThemedCard variant="card" style={styles.container} borderVariant="primary">
      <ThemedView style={styles.header}>
        <ThemedView style={[styles.indicator, { backgroundColor: theme.status.info + '40' }]} />
        <ThemedLanguageText
          variant="primary"
          size="large"
          style={styles.title}
          fontFamily="regional_secondary"
        >
          সপ্তাহের পরিসংখ্যান
        </ThemedLanguageText>
      </ThemedView>
      <View style={styles.chart}>
        {data.map((item, index) => {
          const barHeight = (item.versesRead / maxVerses) * BAR_MAX_HEIGHT;
          return (
            <View key={index} style={styles.barContainer}>
              <View style={styles.barWrapper}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight || 4,
                      backgroundColor: barHeight > 0 ? theme.status.success : theme.background.tertiary,
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
    marginTop: SIZES.spacing.xl,
    padding: SIZES.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  indicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xxxl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.md,
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
  },
  valueLabel: {
    fontSize: 10,
    marginTop: 2,
    fontWeight: '600',
  },
});

