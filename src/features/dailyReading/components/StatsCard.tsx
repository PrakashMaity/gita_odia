import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

interface StatsCardProps {
  title: string;
  value: string;
  iconName: keyof typeof Ionicons.glyphMap;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  iconName
}) => {
  return (
    <Box className="flex-1 items-center justify-center p-6 min-h-[130px] rounded-2xl bg-white shadow-sm border border-primary-200">
      <Box className="w-12 h-12 rounded-full items-center justify-center mb-3 bg-primary-100">
        <Ionicons
          name={iconName}
          size={24}
          color="#0f172a"
        />
      </Box>
      <Text className="text-3xl font-bold mb-1 text-center font-regional_secondary text-primary-950">
        {value}
      </Text>
      <Text className="text-xs font-medium text-center opacity-75 font-regional_secondary text-primary-600">
        {title}
      </Text>
    </Box>
  );
};
