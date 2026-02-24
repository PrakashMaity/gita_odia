import { useProStatus } from '@/hooks/useProStatus';
import { useColorScheme } from 'nativewind';

const semanticColors = {
  pro: {
    light: {
      primary400: '#FBBF24',
      primary500: '#F59E0B',
      primary600: '#D97706',
      primary700: '#B45309',
      primary800: '#92400E',
      secondary800: '#3E2723',
      secondary900: '#2C1810',
      tertiary600: '#E11D48',
    },
    dark: {
      primary400: '#FBBF24',
      primary500: '#F59E0B',
      primary600: '#D97706',
      primary700: '#B45309',
      primary800: '#92400E',
      secondary800: '#3E2723',
      secondary900: '#2C1810',
      tertiary600: '#E11D48',
    }
  },
  classic: {
    light: {
      primary400: '#9CA3AF',
      primary500: '#6B7280',
      primary600: '#4B5563',
      primary700: '#374151',
      primary800: '#1F2937',
      secondary800: '#1F2937',
      secondary900: '#111827',
      tertiary600: '#4B5563',
    },
    dark: {
      primary400: '#9CA3AF',
      primary500: '#6B7280',
      primary600: '#4B5563',
      primary700: '#374151',
      primary800: '#1F2937',
      secondary800: '#1F2937',
      secondary900: '#111827',
      tertiary600: '#4B5563',
    }
  }
};

export const useSemanticColors = () => {
  const { isPro } = useProStatus();
  const { colorScheme } = useColorScheme();

  const mode = isPro ? 'pro' : 'classic';
  const theme = colorScheme || 'light';
  const colors = semanticColors[mode][theme];

  return {
    colors,
    rgba: (hex: string, alpha: number) => {
      // Basic hex to rgba converter for secondary800
      let r = 0, g = 0, b = 0;
      if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
  };
};
