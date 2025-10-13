import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { TouchableOpacity, ViewStyle } from 'react-native';

interface NeumorphicButtonProps {
  onPress: () => void;
  children: React.ReactNode;
  size?: number;
  variant?: 'primary' | 'secondary' | 'play';
  style?: ViewStyle;
  disabled?: boolean;
}

export const NeumorphicButton: React.FC<NeumorphicButtonProps> = ({
  onPress,
  children,
  size = 60,
  variant = 'primary',
  style,
  disabled = false,
}) => {
  const theme = useThemeColors();

  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      width: size,
      height: size,
      borderRadius: size / 2,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    };

    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: theme.background.card,
        borderWidth: 1,
        borderColor: theme.border.tertiary,
      },
      secondary: {
        backgroundColor: theme.background.secondary,
        borderWidth: 1,
        borderColor: theme.border.secondary,
      },
      play: {
        backgroundColor: theme.background.card,
        borderWidth: 2,
        borderColor: theme.icon.secondary,
        shadowColor: theme.icon.secondary,
        shadowOpacity: 0.4,
      },
    };

    const disabledStyle: ViewStyle = disabled ? {
      opacity: 0.5,
      shadowOpacity: 0.1,
    } : {};

    return {
      ...baseStyle,
      ...variantStyles[variant],
      ...disabledStyle,
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      {children}
    </TouchableOpacity>
  );
};
