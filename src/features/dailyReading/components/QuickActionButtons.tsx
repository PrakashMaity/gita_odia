import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

interface QuickActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  primary?: boolean;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon,
  label,
  onPress,
  primary = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-1"
    >
      <Box
        className={`items-center justify-center p-4 min-h-[100px] rounded-2xl border ${primary ? 'bg-white border-white' : 'bg-neutral-900 border-neutral-800'
          }`}
      >
        <Box
          className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${primary ? 'bg-black/10' : 'bg-neutral-800'
            }`}
        >
          <Ionicons
            name={icon}
            size={24}
            color={primary ? 'black' : 'white'}
          />
        </Box>
        <Text
          className={`text-xs font-bold text-center font-regional_secondary ${primary ? 'text-black' : 'text-white'
            }`}
        >
          {label}
        </Text>
      </Box>
    </TouchableOpacity>
  );
};

export const QuickActionButtons: React.FC = () => {
  const handleStartReading = () => {
    router.push('/(tabs)/chapters');
  };

  const handleViewProgress = () => {
    router.push('/(tabs)/chapters');
  };

  const handleVerseOfDay = () => {
    router.push('/verse-of-the-day');
  };

  return (
    <View className="flex-row gap-4 mt-6 mb-4">
      <QuickActionButton
        icon="book"
        label="পাঠ শুরু করুন"
        onPress={handleStartReading}
        primary={true}
      />
      <QuickActionButton
        icon="stats-chart"
        label="অগ্রগতি"
        onPress={handleViewProgress}
      />
      <QuickActionButton
        icon="sparkles"
        label="আজকের শ্লোক"
        onPress={handleVerseOfDay}
      />
    </View>
  );
};
