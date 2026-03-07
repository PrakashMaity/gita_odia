import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export const TranslationsHeader: React.FC = () => {
  return (
    <ScreenHeader
      containerClassName="bg-white"
      leftContent={
        <Box className="flex-1 flex-row items-center">
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full justify-center items-center mr-4 bg-primary-50"
          >
            <Ionicons name="arrow-back" size={24} color="#0f172a" />
          </TouchableOpacity>

          <Text
            className="flex-shrink text-primary-950 text-xl font-bold font-regional_secondary"
          >
            {i18n.t('menu.translations')}
          </Text>
        </Box>
      }
      rightContent={
        <Box className="w-10 h-10 rounded-full justify-center items-center border border-primary-200 bg-white shadow-sm">
          <MaterialIcons name="translate" size={24} color="#0f172a" />
        </Box>
      }
    />
  );
};

