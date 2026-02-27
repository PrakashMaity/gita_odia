import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import React from 'react';
import { View } from 'react-native';

const BAR_MAX_HEIGHT = 100;

interface WeeklyChartProps {
  data: { date: string; versesRead: number }[];
}

export const WeeklyChart: React.FC<WeeklyChartProps> = ({ data }) => {
  const maxVerses = Math.max(...data.map(d => d.versesRead), 1);

  const getDayLabel = (date: string) => {
    const d = new Date(date);
    const days = [
      i18n.t('dailyReading.days.sun'),
      i18n.t('dailyReading.days.mon'),
      i18n.t('dailyReading.days.tue'),
      i18n.t('dailyReading.days.wed'),
      i18n.t('dailyReading.days.thu'),
      i18n.t('dailyReading.days.fri'),
      i18n.t('dailyReading.days.sat'),
    ];
    return days[d.getDay()];
  };

  return (
    <Box className="mt-6 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
      <View className="flex-row items-center mb-6">
        <Text className="flex-1 text-lg font-bold text-white font-regional_secondary">
          {i18n.t('dailyReading.weeklyStats')}
        </Text>
      </View>
      <View className="flex-row justify-around items-end h-[160px] px-1">
        {data.map((item, index) => {
          const barHeight = (item.versesRead / maxVerses) * BAR_MAX_HEIGHT;
          const hasValue = item.versesRead > 0;

          return (
            <View key={index} className="flex-1 items-center justify-end">
              <View className="w-4/5 h-[100px] justify-end items-center mb-1">
                <View
                  className={`w-full min-h-[4px] rounded-sm ${hasValue ? 'bg-white' : 'bg-neutral-800'}`}
                  style={{
                    height: hasValue ? Math.max(barHeight, 4) : 4,
                  }}
                />
              </View>
              <Text className="text-[11px] mt-1 text-center font-medium text-neutral-400 font-regional_secondary">
                {getDayLabel(item.date)}
              </Text>
              <Text className="text-[10px] mt-0.5 font-bold opacity-80 text-white font-regional_secondary">
                {item.versesRead}
              </Text>
            </View>
          );
        })}
      </View>
    </Box>
  );
};
