import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';

const PRO_BENEFITS = [
  'subscription.features.adFree',
  'subscription.features.allFeatures',
  'subscription.features.prioritySupport',
  'subscription.features.unlimitedAccess',
];

export const ProBenefitsSection: React.FC = () => {
  return (
    <Box className="mx-6 mb-8 p-6 rounded-2xl bg-white border border-primary-200 shadow-sm">
      <View className="flex-row items-center justify-center mb-6 space-x-3">
        <MaterialIcons
          name="workspace-premium"
          size={32}
          color="#0f172a"
        />
        <Text className="text-xl font-bold text-center text-primary-950 font-regional_secondary">
          {i18n.t('subscription.features.title')}
        </Text>
      </View>

      <View className="space-y-4">
        {PRO_BENEFITS.map((benefitKey, index) => (
          <View key={index} className="flex-row items-center py-1">
            <MaterialIcons
              name="check-circle"
              size={24}
              color="#0ea5e9"
              className="mr-4"
            />
            <Text className="flex-1 text-[15px] leading-6 text-primary-700 font-regional_secondary">
              {i18n.t(benefitKey)}
            </Text>
          </View>
        ))}
      </View>
    </Box>
  );
};
