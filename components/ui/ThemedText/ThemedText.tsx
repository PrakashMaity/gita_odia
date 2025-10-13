import { TYPOGRAPHY } from '@/constants/typography';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useThemeColors } from '../../../hooks/useTheme';
import { TextSize, TextVariant } from './types';

export interface ThemedTextProps extends TextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: keyof typeof TYPOGRAPHY.fontWeight;
  style?: TextStyle;
  children: React.ReactNode;
}

export const ThemedText: React.FC<ThemedTextProps> = ({
  variant = 'primary',
  size = 'md',
  weight = 'normal',
  style,
  children,
  ...props
}) => {
  const theme = useThemeColors();

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
     
      fontSize: TYPOGRAPHY.fontSize[size],
      fontWeight: TYPOGRAPHY.fontWeight[weight],
      letterSpacing: TYPOGRAPHY.letterSpacing.normal,
    };

    // Variant styles
    const variantStyles: Record<TextVariant, TextStyle> = {
      primary: {
        color: theme.text.primary,
      },
      secondary: {
        color: theme.text.secondary,
      },
      disabled: {
        color: theme.text.disabled,
      },
      error: {
        color: theme.text.error,
      },
      success: {
        color: theme.text.success,
      },
      warning: {
        color: theme.text.warning,
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...style,
    };
  };

  return (
    <Text style={getTextStyle()} {...props}>
      {children}
    </Text>
  );
};
