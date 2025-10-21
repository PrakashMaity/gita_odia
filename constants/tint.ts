import Constants from 'expo-constants';
import { assameseColors } from '../clients/as/theme';
import { bengaliColors } from '../clients/bn/theme';
import { englishColors } from '../clients/en/theme';
import { hindiColors } from '../clients/hi/theme';
import { odiaColors } from '../clients/or/theme';

// Type for client color configuration
export interface ClientColors {
  primary50: string;
  primary100: string;
  primary200: string;
  primary300: string;
  primary400: string;
  primary500: string;
  primary600: string;
  primary700: string;
  primary800: string;
  primary900: string;
  
  secondary50: string;
  secondary100: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  secondary500: string;
  secondary600: string;
  secondary700: string;
  secondary800: string;
  secondary900: string;
  
  tertiary50: string;
  tertiary100: string;
  tertiary200: string;
  tertiary300: string;
  tertiary400: string;
  tertiary500: string;
  tertiary600: string;
  tertiary700: string;
  tertiary800: string;
  tertiary900: string;
  
  quaternary50: string;
  quaternary100: string;
  quaternary200: string;
  quaternary300: string;
  quaternary400: string;
  quaternary500: string;
  quaternary600: string;
  quaternary700: string;
  quaternary800: string;
  quaternary900: string;
  
  accent50: string;
  accent100: string;
  accent200: string;
  accent300: string;
  accent400: string;
  accent500: string;
  accent600: string;
  accent700: string;
  accent800: string;
  accent900: string;
}

// Get client-specific colors based on APP_LANG environment variable
const getClientColors = (): ClientColors => {
  const language = Constants.expoConfig?.extra?.LANGUAGE || 'or';
  
  switch (language) {
    case 'bn':
      return bengaliColors;
    case 'en':
      return englishColors;
    case 'hi':
      return hindiColors;
    case 'as':
      return assameseColors;
    case 'or':
    default:
      return odiaColors;
  }
};

// Get client colors
const clientColors = getClientColors();

// Export colors with client-specific values
export const colors = {
  // White scale (common across all clients)
  white: '#FFFFFF',
  white100: '#FEFEFE',
  white200: '#F8F8F8',
  white300: '#F0F0F0',
  
  // Black scale (common across all clients)
  black: '#000000',
  black900: '#0A0A0A',
  black800: '#1A1A1A',
  black700: '#2A2A2A',
  black600: '#3A3A3A',
  
  // Client-specific Primary Colors
  primary50: clientColors.primary50,
  primary100: clientColors.primary100,
  primary200: clientColors.primary200,
  primary300: clientColors.primary300,
  primary400: clientColors.primary400,
  primary500: clientColors.primary500,
  primary600: clientColors.primary600,
  primary700: clientColors.primary700,
  primary800: clientColors.primary800,
  primary900: clientColors.primary900,
  
  // Client-specific Secondary Colors
  secondary50: clientColors.secondary50,
  secondary100: clientColors.secondary100,
  secondary200: clientColors.secondary200,
  secondary300: clientColors.secondary300,
  secondary400: clientColors.secondary400,
  secondary500: clientColors.secondary500,
  secondary600: clientColors.secondary600,
  secondary700: clientColors.secondary700,
  secondary800: clientColors.secondary800,
  secondary900: clientColors.secondary900,
  
  // Client-specific Tertiary Colors
  tertiary50: clientColors.tertiary50,
  tertiary100: clientColors.tertiary100,
  tertiary200: clientColors.tertiary200,
  tertiary300: clientColors.tertiary300,
  tertiary400: clientColors.tertiary400,
  tertiary500: clientColors.tertiary500,
  tertiary600: clientColors.tertiary600,
  tertiary700: clientColors.tertiary700,
  tertiary800: clientColors.tertiary800,
  tertiary900: clientColors.tertiary900,
  
  // Client-specific Quaternary Colors
  quaternary50: clientColors.quaternary50,
  quaternary100: clientColors.quaternary100,
  quaternary200: clientColors.quaternary200,
  quaternary300: clientColors.quaternary300,
  quaternary400: clientColors.quaternary400,
  quaternary500: clientColors.quaternary500,
  quaternary600: clientColors.quaternary600,
  quaternary700: clientColors.quaternary700,
  quaternary800: clientColors.quaternary800,
  quaternary900: clientColors.quaternary900,
  
  // Client-specific Accent Colors
  accent50: clientColors.accent50,
  accent100: clientColors.accent100,
  accent200: clientColors.accent200,
  accent300: clientColors.accent300,
  accent400: clientColors.accent400,
  accent500: clientColors.accent500,
  accent600: clientColors.accent600,
  accent700: clientColors.accent700,
  accent800: clientColors.accent800,
  accent900: clientColors.accent900,
  
  // Data Visualization Colors - Light Theme (common across all clients)
  dataLight: {
    blue: '#2563EB',
    green: '#059669',
    orange: '#EA580C',
    red: '#DC2626',
    purple: '#7C3AED',
    teal: '#0D9488',
    yellow: '#D97706',
    pink: '#EC4899',
    indigo: '#4F46E5',
    emerald: '#10B981',
    amber: '#F59E0B',
    rose: '#F43F5E',
    cyan: '#06B6D4',
    lime: '#84CC16',
    violet: '#8B5CF6',
    fuchsia: '#D946EF',
    sky: '#0EA5E9',
    stone: '#78716C',
    neutral: '#525252',
    zinc: '#71717A',
    slate: '#64748B',
    gray: '#6B7280',
    coolGray: '#6B7280',
    warmGray: '#78716C',
  },
  
  // Data Visualization Colors - Dark Theme (common across all clients)
  dataDark: {
    blue: '#60A5FA',
    green: '#34D399',
    orange: '#FB923C',
    red: '#F87171',
    purple: '#A78BFA',
    teal: '#5EEAD4',
    yellow: '#FCD34D',
    pink: '#F472B6',
    indigo: '#818CF8',
    emerald: '#6EE7B7',
    amber: '#FBBF24',
    rose: '#FB7185',
    cyan: '#67E8F9',
    lime: '#A3E635',
    violet: '#C4B5FD',
    fuchsia: '#E879F9',
    sky: '#7DD3FC',
    stone: '#A8A29E',
    neutral: '#A3A3A3',
    zinc: '#A1A1AA',
    slate: '#94A3B8',
    gray: '#9CA3AF',
    coolGray: '#9CA3AF',
    warmGray: '#A8A29E',
  },
};

// Helper function to get client language
export const getClientLanguage = (): string => {
  return Constants.expoConfig?.extra?.LANGUAGE || 'or';
};
