import { SIZES } from '@/rootconstants/sizes';
import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { useThemeColors } from '@/hooks/useTheme';
import { ViewVariant } from './types';

export interface ThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export const ThemedView: React.FC<ThemedViewProps> = ({
  variant = 'transparent',
  style,
  children,
  ...props
}) => {
  const theme = useThemeColors();

  const getViewStyle = (): StyleProp<ViewStyle> => {
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

    const finalStyle: ViewStyle = {
      ...baseStyle,
      ...variantStyles[variant],
    };

    if (!style) {
      return finalStyle;
    }

    if (Array.isArray(style)) {
      return [finalStyle, ...style];
    }

    return [finalStyle, style];
  };

  return (
    <View style={getViewStyle()} {...props}>
      {children}
    </View>
  );
};
