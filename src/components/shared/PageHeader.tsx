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
      containerClassName="bg-background-0 dark:bg-secondary-900 pb-4 border-b border-primary-100 dark:border-secondary-800"
      leftContent={
        <View className="flex-row items-center flex-1">
          {showBackButton ? (
            <TouchableOpacity
              onPress={handleBack}
              className="w-10 h-10 bg-background-0 dark:bg-secondary-800 border border-primary-200 dark:border-secondary-700 shadow-soft-1 rounded-xl items-center justify-center mr-4 active:opacity-70"
            >
              <Ionicons name="arrow-back" size={20} className="text-typography-950 dark:text-typography-300" />
            </TouchableOpacity>
          ) : null}

          <View className="flex-1 justify-center">
            <Text className="text-[22px] font-extrablack tracking-tight text-typography-950 dark:text-white" style={{ fontFamily: 'regional-secondary' }}>
              {title}
            </Text>
            {subtitle ? (
              <Text className="text-[14px] font-medium text-typography-500 dark:text-typography-400 mt-0.5" style={{ fontFamily: 'regional-secondary' }}>
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
