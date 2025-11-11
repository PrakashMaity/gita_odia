import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useThemeColors } from '@/hooks/useTheme';
import { HomeImages } from '@/utils/assets';
import React from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { styles } from './ScreenHeader.styles';

type LanguageTextProps = Partial<React.ComponentProps<typeof ThemedLanguageText>>;

interface ScreenHeaderProps {
  title?: string;
  subtitle?: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  backgroundSource?: ImageSourcePropType;
  blurRadius?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  leftSectionStyle?: StyleProp<ViewStyle>;
  rightSectionStyle?: StyleProp<ViewStyle>;
  titleProps?: LanguageTextProps;
  subtitleProps?: LanguageTextProps;
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
  containerStyle,
  contentStyle,
  leftSectionStyle,
  rightSectionStyle,
  titleProps,
  subtitleProps,
  imageStyle,
  testID,
}) => {
  const theme = useThemeColors();
  const { style: titleStyleProp, ...titleRestProps } = titleProps ?? {};
  const { style: subtitleStyleProp, ...subtitleRestProps } = subtitleProps ?? {};
  const headerOverlayColor = theme.background.tertiary;

  const renderDefaultText = () => {
    if (!title && !subtitle) {
      return null;
    }

    return (
      <ThemedView variant="transparent" style={styles.textWrapper}>
        {title ? (
          <ThemedLanguageText
            variant="primary"
            size="title"
            fontFamily="regional_secondary"
            style={[styles.title, titleStyleProp]}
            {...titleRestProps}
          >
            {title}
          </ThemedLanguageText>
        ) : null}

        {subtitle ? (
          <ThemedLanguageText
            variant="secondary"
            size="medium"
            fontFamily="regional_secondary"
            style={[styles.subtitle, subtitleStyleProp]}
            {...subtitleRestProps}
          >
            {subtitle}
          </ThemedLanguageText>
        ) : null}
      </ThemedView>
    );
  };

  return (
    <ThemedView
      testID={testID}
      style={[styles.headerContainer, containerStyle]}
    >
      <ImageBackground
        source={backgroundSource}
        style={[styles.headerBackground, { backgroundColor: headerOverlayColor }]}
        imageStyle={[styles.headerImage, imageStyle]}
        resizeMode="cover"
        blurRadius={blurRadius}
      >
        <View pointerEvents="none" style={[styles.overlay, { backgroundColor: headerOverlayColor }]} />
        <ThemedView
          variant="transparent"
          style={[styles.headerContent, contentStyle]}
        >
          <ThemedView
            variant="transparent"
            style={[styles.leftSection, leftSectionStyle]}
          >
            {leftContent ?? renderDefaultText()}
          </ThemedView>

          {rightContent ? (
            <ThemedView
              variant="transparent"
              style={[styles.rightSection, rightSectionStyle]}
            >
              {rightContent}
            </ThemedView>
          ) : null}
        </ThemedView>
      </ImageBackground>
    </ThemedView>
  );
};


