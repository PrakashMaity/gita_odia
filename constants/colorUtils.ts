import { Theme } from '../interface/color.interface';
import { colors } from './tint';

// Color combination presets for different design scenarios
export const getColorPresets = (theme: Theme) => ({
  // Primary-focused designs
  primary: {
    background: theme.background.primary,
    text: theme.text.primary,
    icon: theme.icon.primary,
    border: theme.border.primary,
    button: theme.button.primary,
  },
  // Secondary-focused designs
  secondary: {
    background: theme.background.secondary,
    text: theme.text.secondary,
    icon: theme.icon.secondary,
    border: theme.border.secondary,
    button: theme.button.secondary,
  },
  // Tertiary-focused designs
  tertiary: {
    background: theme.background.tertiary,
    text: theme.text.tertiary,
    icon: theme.icon.tertiary,
    border: theme.border.tertiary,
    button: theme.button.tertiary,
  },
  // Quaternary-focused designs
  quaternary: {
    background: theme.background.quaternary,
    text: theme.text.quaternary,
    icon: theme.icon.quaternary,
    border: theme.border.quaternary,
    button: theme.button.quaternary,
  },
});

// Semantic color combinations
export const semanticColors = {
  // Success states
  success: {
    background: colors.green,
    text: colors.white,
    icon: colors.green,
    border: colors.green,
  },
  
  // Error states
  error: {
    background: colors.red,
    text: colors.white,
    icon: colors.red,
    border: colors.red,
  },
  
  // Warning states
  warning: {
    background: colors.yellow,
    text: colors.black,
    icon: colors.yellow,
    border: colors.yellow,
  },
  
  // Info states
  info: {
    background: colors.blue,
    text: colors.white,
    icon: colors.blue,
    border: colors.blue,
  },
};

// Gradient color combinations
export const gradients = {
  light: {
    primary: [colors.primary400, colors.primary600],
    secondary: [colors.secondary400, colors.secondary600],
    tertiary: [colors.tertiary400, colors.tertiary600],
    quaternary: [colors.quaternary400, colors.quaternary600],
    sunset: [colors.primary400, colors.tertiary400],
    ocean: [colors.secondary400, colors.quaternary400],
  },
  dark: {
    primary: [colors.maroon400, colors.maroon600],
    secondary: [colors.indigo, colors.purple],
    tertiary: [colors.purple, colors.maroon400],
    quaternary: [colors.teal, colors.secondary400],
    night: [colors.maroon400, colors.black900],
    aurora: [colors.purple, colors.teal],
  },
};

// Accessibility helpers
export const accessibility = {
  // High contrast combinations
  highContrast: {
    light: {
      primary: colors.primary900,
      secondary: colors.secondary900,
      tertiary: colors.tertiary900,
      quaternary: colors.quaternary900,
    },
    dark: {
      primary: colors.maroon100,
      secondary: colors.indigo,
      tertiary: colors.purple,
      quaternary: colors.teal,
    },
  },
  
  // Color blindness friendly combinations
  colorBlindFriendly: {
    light: [colors.primary600, colors.secondary600, colors.tertiary600, colors.quaternary600],
    dark: [colors.maroon600, colors.indigo, colors.purple, colors.teal],
  },
};

// Utility functions
export const getColorShade = (color: string, shade: number) => {
  // This function can be used to dynamically get color shades
  // Implementation depends on your specific needs
  return color;
};

export const getContrastColor = (backgroundColor: string) => {
  // Simple contrast calculation - you might want to use a more sophisticated library
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? colors.black : colors.white;
};
