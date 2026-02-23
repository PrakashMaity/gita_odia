import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, View } from 'react-native';

interface StreakCardProps {
  currentStreak: number;
  longestStreak: number;
}

export const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  longestStreak,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const animatedStyle = {
    opacity: fadeAnim,
  };

  return (
    <Animated.View style={animatedStyle}>
      <Box className="w-full mt-6 mb-4 p-6 rounded-2xl bg-neutral-900 border border-neutral-800">
        <View className="items-center justify-center">
          <Box className="w-16 h-16 rounded-full items-center justify-center mb-4 border border-white bg-black">
            <Ionicons
              name="flame"
              size={32}
              color="white"
            />
          </Box>

          <Text className="text-[56px] font-bold mb-1 text-center font-regional_secondary text-white">
            {currentStreak}
          </Text>

          <Text className="text-base font-medium text-center mb-2 opacity-80 font-regional_secondary text-neutral-400">
            {i18n.t('dailyReading.streakLabel')}
          </Text>

          {longestStreak > currentStreak && (
            <View className="flex-row items-center mt-1 px-4 py-1.5 rounded-lg border border-neutral-800 bg-black">
              <Ionicons
                name="trophy-outline"
                size={16}
                color="white"
                className="mr-2"
              />
              <Text className="text-[13px] opacity-70 font-regional_secondary text-neutral-400 ml-1">
                {i18n.t('dailyReading.longestStreakLabel', { count: longestStreak })}
              </Text>
            </View>
          )}
        </View>
      </Box>
    </Animated.View>
  );
};
