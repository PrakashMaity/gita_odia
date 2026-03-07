import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
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
        className={`items-center justify-center p-4 min-h-[100px] rounded-2xl border ${primary ? 'bg-primary-500 border-primary-500 shadow-md' : 'bg-white border-primary-200 shadow-sm'
          }`}
      >
        <Box
          className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${primary ? 'bg-white/20' : 'bg-primary-100'
            }`}
        >
          <Ionicons
            name={icon}
            size={24}
            color={primary ? 'white' : '#0f172a'}
          />
        </Box>
        <Text
          className={`text-xs font-bold text-center font-regional_secondary ${primary ? 'text-white' : 'text-primary-950'
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
        label={i18n.t('dailyReading.startReading')}
        onPress={handleStartReading}
        primary={true}
      />
      <QuickActionButton
        icon="stats-chart"
        label={i18n.t('dailyReading.progress')}
        onPress={handleViewProgress}
      />
      <QuickActionButton
        icon="sparkles"
        label={i18n.t('dailyReading.todaysVerse')}
        onPress={handleVerseOfDay}
      />
    </View>
  );
};
