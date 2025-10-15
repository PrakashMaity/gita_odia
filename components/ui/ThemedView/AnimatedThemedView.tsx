import { SIZES } from '@/constants/sizes';
import React from 'react';
import { Animated, ViewProps, ViewStyle } from 'react-native';
import { useThemeColors } from '../../../hooks/useTheme';
import { ViewVariant } from './types';

interface AnimatedThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  style?: ViewStyle;
  children?: React.ReactNode;
  animatedStyle?: any;
}

export const AnimatedThemedView: React.FC<AnimatedThemedViewProps> = ({
  variant = 'primary',
  style,
  children,
  animatedStyle,
  ...props
}) => {
  const theme = useThemeColors();

  const getViewStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {};

    // Variant styles
    const variantStyles: Record<ViewVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.background.primary,
      },
      secondary: {
        backgroundColor: theme.background.secondary,
      },
      tertiary: {
        backgroundColor: theme.background.tertiary,
      },
      quaternary: {
        backgroundColor: theme.background.quaternary,
      },
      card: {
        backgroundColor: theme.background.card,
        borderRadius: SIZES.radius.md,
        padding: SIZES.spacing.md,
        margin: SIZES.spacing.md,
      },
      transparent: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  return (
    <Animated.View 
      style={[getViewStyle(), animatedStyle]} 
      {...props}
    >
      {children}
    </Animated.View>
  );
};
