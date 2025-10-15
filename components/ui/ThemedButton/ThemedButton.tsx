import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { ThemedLanguageText } from '../ThemedLanguageText/ThemedLanguageText';

export interface ThemedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline'|'basic';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const ThemedButton: React.FC<ThemedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  icon,
  disabled = false,
  style,
  textStyle,
  fullWidth = false,
}) => {
  const theme = useThemeColors();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: SIZES.radius.lg,
      gap: SIZES.spacing.sm,
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      sm: {
        paddingHorizontal: SIZES.spacing.md,
        paddingVertical: SIZES.spacing.sm,
      },
      md: {
        paddingHorizontal: SIZES.spacing.lg,
        paddingVertical: SIZES.spacing.md,
      },
      lg: {
        paddingHorizontal: SIZES.spacing.xl,
        paddingVertical: SIZES.spacing.lg,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? theme.button.disabled.background : theme.button.primary.background,
      },
      secondary: {
        backgroundColor: disabled ? theme.button.disabled.background : theme.button.secondary.background,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? theme.border.secondary : theme.border.primary,
      },
      basic:{
        backgroundColor:theme.background.tertiary,
       
      }
    };

    const widthStyle: ViewStyle = fullWidth ? { flex: 1 } : {};

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      ...widthStyle,
    };
  };

  const getTextStyle = (): TextStyle => {
   const letterSpacing = size === 'sm' ? 0.5 : size === 'md' ? 2 : 2.5;

    const sizeTextStyles: Record<string, TextStyle> = {
      sm: { fontSize: SIZES.md },
      md: { fontSize: SIZES.lg },
      lg: { fontSize: SIZES.xl },
    };

    const variantTextStyles: Record<string, TextStyle> = {
      primary: {
        color: disabled ? theme.text.disabled : theme.button.primary.text,
      },
      secondary: {
        color: disabled ? theme.text.disabled : theme.button.secondary.text,
      },
      outline: {
        color: disabled ? theme.text.disabled : theme.text.primary,
      },
    };

    return {
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      letterSpacing: letterSpacing,
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {icon}
      <ThemedLanguageText 
        fontFamily='regional_secondary'
        variant='primary'
        size='medium'
        style={{...getTextStyle(), ...textStyle}}
      >
        {title}
      </ThemedLanguageText>
    </TouchableOpacity>
  );
};
