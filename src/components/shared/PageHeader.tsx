import { ScreenHeader } from '@/components/shared/ScreenHeader';
import { Text } from '@/components/ui/text';
import { HomeImages } from '@/lib/utils/assets';
import { PageHeaderProps } from '@/types/screen.interface';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = true,
  rightAction,
  onBack,
}) => {
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <ScreenHeader
      backgroundSource={HomeImages.hero}
      blurRadius={3}
      containerClassName="bg-black pb-4 border-b border-neutral-800"
      leftContent={
        <View className="flex-row items-center flex-1">
          {showBackButton ? (
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 bg-neutral-900 border border-neutral-800 rounded-xl items-center justify-center mr-4 active:opacity-70"
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>
          ) : null}

          <View className="flex-1 justify-center">
            <Text className="text-xl font-bold text-white font-regional_secondary">
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-sm font-medium text-neutral-400 mt-0.5 font-regional_secondary">
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      }
      rightContent={
        rightAction ? (
          <View className="ml-4 justify-center items-center">
            {rightAction}
          </View>
        ) : undefined
      }
    />
  );
};
