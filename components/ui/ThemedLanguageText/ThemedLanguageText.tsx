import { getLanguageFonts } from '@/interface/font.interface';
import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';
import { useThemeColors } from '../../../hooks/useTheme';

export type LanguageTextVariant = 
  | 'primary' 
  | 'secondary' 
  | 'tertiary' 
  | 'accent' 
  | 'error' 
  | 'success';

export type LanguageTextSize = 
  | 'xs' 
  | 'small' 
  | 'medium' 
  | 'large' 
  | 'xl' 
  | 'xxl' 
  | 'title';

export type LanguageFontFamily = 
  | 'regional_primary' 
  | 'regional_secondary' 
  | 'regional_tertiary' 
  | 'regional_quaternary'
  | 'primary_english'
  |'none'

export interface ThemedLanguageTextProps extends TextProps {
  variant?: LanguageTextVariant;
  size?: LanguageTextSize;
  fontFamily?: LanguageFontFamily;
  children: React.ReactNode;
}

export const ThemedLanguageText: React.FC<ThemedLanguageTextProps> = ({
  variant = 'primary',
  size = 'medium',
  fontFamily = 'none',
  style,
  children,
  ...props
}) => {
  const theme = useThemeColors();

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      textAlign: 'left',
    };

    // Variant styles
    const variantStyles: Record<LanguageTextVariant, TextStyle> = {
      primary: {
        color: theme.text.primary,
      },
      secondary: {
        color: theme.text.secondary,
      },
      tertiary: {
        color: theme.text.tertiary,
      },
      accent: {
        color: theme.text.primary,
      },
      error: {
        color: theme.text.error,
      },
      success: {
        color: theme.text.success,
      },
    };

    // Size styles
    const sizeStyles: Record<LanguageTextSize, TextStyle> = {
      xs: {
        fontSize: 12,
      },
      small: {
        fontSize: 14,
      },
      medium: {
        fontSize: 16,
      },
      large: {
        fontSize: 18,
      },
      xl: {
        fontSize: 20,
      },
      xxl: {
        fontSize: 24,
      },
      title: {
        fontSize: 28,
      },
    };

    // Font family styles
    const languageFonts = getLanguageFonts();
    const fontFamilyStyles: Record<LanguageFontFamily, TextStyle> = {
      regional_primary: {
        fontFamily: languageFonts.regional_primary,
      },
      regional_secondary: {
        fontFamily: languageFonts.regional_secondary,
      },
      regional_tertiary: {
        fontFamily: languageFonts.regional_tertiary,
      },
      regional_quaternary: {
          fontFamily: languageFonts.regional_quaternary,
      },
      primary_english: {
        fontFamily: languageFonts.primary_english,
      },
      none: {
        fontFamily: 'none',
      },
    };

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...sizeStyles[size],
      ...fontFamilyStyles[fontFamily],
    };
  };

  const textStyle = getTextStyle();

  // Handle both single style and array of styles
  const finalStyle = Array.isArray(style) 
    ? [textStyle, ...style] 
    : { ...textStyle, ...(style as TextStyle) };

  return (
    <Text style={finalStyle} {...props}>
      {children}
    </Text>
  );
};
