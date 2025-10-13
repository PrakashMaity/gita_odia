import { TYPOGRAPHY } from '@/constants/typography';
import React from 'react';
import { Animated, TextProps, TextStyle } from 'react-native';
import { useThemeColors } from '../../../hooks/useTheme';
import { TextSize, TextVariant } from './types';

interface AnimatedThemedTextProps extends TextProps {
  variant?: TextVariant;
  size?: TextSize;
  weight?: keyof typeof TYPOGRAPHY.fontWeight;
  style?: TextStyle;
  children: React.ReactNode;
  animatedValue?: Animated.Value;
  animatedStyle?: any;
}

export const AnimatedThemedText: React.FC<AnimatedThemedTextProps> = ({
  variant = 'primary',
  size = 'md',
  weight = 'normal',
  style,
  children,
  animatedValue,
  animatedStyle,
  ...props
}) => {
  const theme = useThemeColors();

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontFamily: 'AnekBangla-Regular',
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
    <Animated.Text 
      style={[getTextStyle(), animatedStyle]} 
      {...props}
    >
      {children}
    </Animated.Text>
  );
};
