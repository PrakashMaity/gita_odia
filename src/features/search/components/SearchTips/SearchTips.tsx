import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';

export const SearchTips: React.FC = () => {
  return (
    <Box className="px-6 pt-8">
      <Text className="text-lg font-semibold mb-4 text-primary-950 font-regional_secondary">
        {i18n.t('search.searchTips')}
      </Text>
      <Box className="gap-2">
        <Box className="flex-row items-center gap-2">
          <Ionicons name="checkmark-circle" size={16} color="#0f172a" />
          <Text className="text-base flex-1 text-primary-600 font-regional_secondary">
            {i18n.t('search.minCharacters')}
          </Text>
        </Box>
        <Box className="flex-row items-center gap-2">
          <Ionicons name="checkmark-circle" size={16} color="#0f172a" />
          <Text className="text-base flex-1 text-primary-600 font-regional_secondary">
            {i18n.t('search.searchIn')}
          </Text>
        </Box>
        <Box className="flex-row items-center gap-2">
          <Ionicons name="checkmark-circle" size={16} color="#0f172a" />
          <Text className="text-base flex-1 text-primary-600 font-regional_secondary">
            {i18n.t('search.tapToGo')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

