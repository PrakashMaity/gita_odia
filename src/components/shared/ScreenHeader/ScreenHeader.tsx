import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { HomeImages } from '@/lib/utils/assets';
import { useColorScheme } from 'nativewind';
import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  View,
} from 'react-native';

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  backgroundSource?: ImageSourcePropType;
  blurRadius?: number;
  containerClassName?: string;
  contentClassName?: string;
  leftSectionClassName?: string;
  rightSectionClassName?: string;
  imageStyle?: StyleProp<ImageStyle>;
  testID?: string;
}

export const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  title,
  subtitle,
  leftContent,
  rightContent,
  backgroundSource = HomeImages.header,
  blurRadius = 2,
  containerClassName = '',
  contentClassName = '',
  leftSectionClassName = '',
  rightSectionClassName = '',
  imageStyle,
  testID,
}) => {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const headerOverlayColor = isDark ? '#1C1917' : '#ffffff';

  const renderDefaultText = () => {
    if (!title && !subtitle) {
      return null;
    }

    return (
      <Box className="flex-shrink">
        {title ? (
          <Text
            className="text-typography-950 dark:text-white text-xl font-extrablack tracking-tight mb-1"
            style={{ fontFamily: 'regional-secondary' }}
          >
            {title}
          </Text>
        ) : null}

        {subtitle ? (
          <Text
            className="text-typography-500 dark:text-typography-400 text-sm font-medium"
            style={{ fontFamily: 'regional-secondary' }}
          >
            {subtitle}
          </Text>
        ) : null}
      </Box>
    );
  };

  return (
    <Box
      testID={testID}
      className={`shadow-md elevation-6 self-stretch ${containerClassName}`}
    >
      <ImageBackground
        source={backgroundSource}
        style={{ backgroundColor: headerOverlayColor, width: '100%' }}
        imageStyle={imageStyle}
        resizeMode="cover"
        blurRadius={blurRadius}
      >
        <View pointerEvents="none" className="absolute inset-0 opacity-90 dark:opacity-95" style={{ backgroundColor: headerOverlayColor }} />
        <Box
          className={`flex-row items-center justify-between pt-1 pb-4 px-5 w-full ${contentClassName}`}
        >
          <Box
            className={`flex-1 flex-row items-center ${leftSectionClassName}`}
          >
            {leftContent ?? renderDefaultText()}
          </Box>

          {rightContent ? (
            <Box
              className={`flex-row items-center justify-end ml-4 ${rightSectionClassName}`}
            >
              {rightContent}
            </Box>
          ) : null}
        </Box>
      </ImageBackground>
    </Box>
  );
};
