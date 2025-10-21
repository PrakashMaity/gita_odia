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
    background: colors.quaternary200,
    text: colors.white,
    icon: colors.quaternary300,
    border: colors.quaternary200,
  },
  
  // Error states
  error: {
    background: colors.tertiary200,
    text: colors.white,
    icon: colors.tertiary300,
    border: colors.tertiary200,
  },
  
  // Warning states
  warning: {
    background: colors.accent200,
    text: colors.black,
    icon: colors.accent300,
    border: colors.accent200,
  },
  
  // Info states
  info: {
    background: colors.primary200,
    text: colors.white,
    icon: colors.primary300,
    border: colors.primary200,
  },
};

// Gradient color combinations for light mode
export const lightGradients = {
  primary: [colors.primary400, colors.primary600],
  secondary: [colors.secondary400, colors.secondary600],
  tertiary: [colors.tertiary400, colors.tertiary600],
  quaternary: [colors.quaternary400, colors.quaternary600],
  sunset: [colors.primary300, colors.tertiary300],
  nature: [colors.quaternary300, colors.secondary300],
  ocean: [colors.secondary300, colors.primary300],
  fire: [colors.accent300, colors.tertiary300],
};

// Gradient color combinations for dark mode
export const darkGradients = {
  primary: [colors.primary100, colors.primary50],
  secondary: [colors.secondary100, colors.secondary50],
  tertiary: [colors.tertiary100, colors.tertiary50],
  quaternary: [colors.quaternary100, colors.quaternary50],
  night: [colors.black900, colors.primary50],
  aurora: [colors.tertiary100, colors.quaternary100],
  cosmic: [colors.black900, colors.tertiary50],
  mystical: [colors.accent100, colors.primary100],
};

// Utility function to get contrast color (black or white based on background)
export const getContrastColor = (backgroundColor: string): string => {
  // Remove # if present
  const hex = backgroundColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate perceived brightness
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Return black for light backgrounds, white for dark backgrounds
  return brightness > 128 ? colors.black : colors.white;
};

// Utility function to adjust color opacity
export const addOpacity = (color: string, opacity: number): string => {
  // Clamp opacity between 0 and 1
  const clampedOpacity = Math.max(0, Math.min(1, opacity));
  
  // Convert opacity to hex (00-FF)
  const alpha = Math.round(clampedOpacity * 255).toString(16).padStart(2, '0');
  
  // Return color with alpha
  return `${color}${alpha}`;
};

// Utility function to get color shade dynamically
export const getColorShade = (
  colorFamily: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'accent',
  shade: 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900
): string => {
  const colorKey = `${colorFamily}${shade}` as keyof typeof colors;
  return colors[colorKey] as string;
};
