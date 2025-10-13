import { SIZES } from '@/constants/sizes';
import React from 'react';
import { View, ViewProps, ViewStyle } from 'react-native';
import { useThemeColors } from '../../../hooks/useTheme';
import { ViewVariant } from './types';

export interface ThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'transparent',
  style,
  children,
  ...props
}) => {
  const theme = useThemeColors();

  const getViewStyle = (): ViewStyle | ViewStyle[] => {
    const baseStyle: ViewStyle = {};

    // Variant styles
    const variantStyles: Record<ViewVariant, ViewStyle> = {
      primary: {
        backgroundColor: theme.background.primary,
      },
      secondary: {
        backgroundColor: theme.background.secondary,
      },
      card: {
        backgroundColor: theme.background.card,
        borderRadius: SIZES.radius.md,
        padding: SIZES.spacing.md,
        margin: SIZES.spacing.md,
       
      },
      tertiary: {
        backgroundColor: theme.background.tertiary,
      },
      quaternary: {
        backgroundColor: theme.background.quaternary,
      },
      transparent: {
        backgroundColor: 'transparent',
      },
    };

    const finalStyle = {
      ...baseStyle,
      ...variantStyles[variant],
    };

    // Handle both single style and array of styles
    if (Array.isArray(style)) {
      return [finalStyle, ...style];
    }

    return {
      ...finalStyle,
      ...style,
    };
  };

  return (
    <View style={getViewStyle()} {...props}>
      {children}
    </View>
  );
};
