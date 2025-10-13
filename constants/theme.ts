import { Theme } from '../interface/color.interface';
import { colors } from './tint';

export type { Theme };
export type ThemeMode = 'light' | 'dark' | 'system';

export const generateTheme = (mode: ThemeMode): Theme => {
  if (mode === 'light') {
    return {
      background: {
        primary: '#FFF8E1',             // Saffron cream (main content area)
        secondary: '#FFE0B2',           // Light saffron (secondary background)
        card: '#FFCC80',                // Golden saffron (card backgrounds)
        tertiary: '#FFAB40',            // Bright orange (accent areas)
        quaternary: '#FF8A65',          // Light orange (highlights and CTAs)
      },
      text: {
        primary: '#1A0E0A',             // Very dark brown (main text - high contrast)
        secondary: '#2E1B16',           // Dark brown (secondary text - better contrast)
        disabled: '#8D6E63',            // Medium brown (disabled text - more visible)
        error: '#B71C1C',               // Very deep red (error text - high contrast)
        success: '#1B5E20',             // Very dark green (success text - high contrast)
        warning: '#E65100',             // Dark orange (warning text - high contrast)
        tertiary: '#BF360C',            // Very deep orange-red (tertiary text - high contrast)
        quaternary: '#D84315',          // Deep orange-red (quaternary text - high contrast)
      },
      icon: {
        primary: '#E65100',             // Dark orange (primary icons - high contrast)
        secondary: '#BF360C',           // Very deep orange-red (secondary icons - high contrast)
        tertiary: '#B71C1C',            // Very deep red (tertiary icons - high contrast)
        quaternary: '#1B5E20',          // Very dark green (quaternary icons - high contrast)
        disabled: '#FFAB40',            // Bright orange (disabled icons - more visible)
        error: '#B71C1C',               // Very deep red (error icons - high contrast)
        success: '#1B5E20',             // Very dark green (success icons - high contrast)
        warning: '#E65100',             // Dark orange (warning icons - high contrast)
      },
      border: {
        primary: '#E65100',             // Dark orange (primary borders - high contrast)
        secondary: '#BF360C',           // Very deep orange-red (secondary borders - high contrast)
        error: '#B71C1C',               // Very deep red (error borders - high contrast)
        tertiary: '#5D4037',            // Dark brown (tertiary borders - better contrast)
        quaternary: '#E65100',          // Dark orange (quaternary borders - high contrast)
      },
      button: {
        primary: {
          background: '#FF6F00',        // Deep orange (main action buttons)
          text: colors.white,           // White text
        },
        secondary: {
          background: '#BF360C',        // Very deep orange-red (secondary buttons)
          text: colors.white,           // White text
        },
        tertiary: {
          background: '#8D6E63',        // Rich brown (tertiary buttons)
          text: colors.white,           // White text
        },
        quaternary: {
          background: '#D84315',        // Deep orange-red (quaternary buttons)
          text: colors.white,           // White text
        },
        disabled: {
          background: '#BCAAA4',        // Light brown (disabled)
          text: '#A1887F',              // Medium brown text
        },
      },
      status: {
        success: '#1B5E20',             // Very dark green (success status - high contrast)
        error: '#B71C1C',               // Very deep red (error status - high contrast)
        warning: '#E65100',             // Dark orange (warning status - high contrast)
        info: '#D84315',                // Deep orange-red (info status - high contrast)
      },
      data: {
        // Primary data colors (8 colors - perfect for most visualizations)
        primary: [
          '#E65100',  // Dark orange (high contrast)
          '#BF360C',  // Very deep orange-red (high contrast)
          '#B71C1C',  // Very deep red (high contrast)
          '#1B5E20',  // Very dark green (high contrast)
          '#FFAB40',  // Bright orange (high contrast)
          '#D84315',  // Deep orange-red (high contrast)
          '#FF6F00',  // Deep orange (high contrast)
          '#FF8A65',  // Light orange (high contrast)
        ],
        // Extended data colors (16 colors - for complex visualizations)
        extended: [
          '#E65100',  // Dark orange (high contrast)
          '#BF360C',  // Very deep orange-red (high contrast)
          '#B71C1C',  // Very deep red (high contrast)
          '#1B5E20',  // Very dark green (high contrast)
          '#FFAB40',  // Bright orange (high contrast)
          '#D84315',  // Deep orange-red (high contrast)
          '#FF6F00',  // Deep orange (high contrast)
          '#FF8A65',  // Light orange (high contrast)
          '#FFF8E1',  // Saffron cream (background)
          '#FFE0B2',  // Light saffron (background)
          '#FFCC80',  // Golden saffron (background)
          '#FFAB40',  // Bright orange (accent)
          '#1A0E0A',  // Very dark brown (text only)
          '#2E1B16',  // Dark brown (text only)
          '#FF7043',  // Medium orange (high contrast)
          '#FFB74D',  // Light orange (high contrast)
        ],
        // Semantic data colors
        semantic: {
          positive: '#1B5E20',          // Very dark green (high contrast)
          negative: '#B71C1C',          // Very deep red (high contrast)
          neutral: '#FFAB40',           // Bright orange (high contrast)
          highlight: '#E65100',         // Dark orange (high contrast)
        },
        // Data visualization background colors
        background: {
          primary: '#FFF8E1',           // Saffron cream (matches main theme)
          secondary: '#FFE0B2',         // Light saffron
          grid: '#FFCC80',              // Golden saffron grid lines
          axis: '#8D6E63',              // Rich brown axis lines
        },
      },
    };
  } else {
    return {
      background: {
        primary: '#0A0E1A',             // Deep navy blue (main background)
        secondary: '#1A2332',           // Rich dark blue (secondary background)
        card: '#2A3441',                // Medium dark blue (card backgrounds)
        tertiary: '#1E3A5F',            // Deep blue (tertiary)
        quaternary: '#2563EB',          // Bright blue (quaternary)
      },
      text: {
        primary: colors.white,           // White (main text)
        secondary: '#E0E7FF',           // Light blue-white (secondary text)
        disabled: '#94A3B8',            // Medium blue-gray (disabled)
        error: '#F87171',               // Light red (error text)
        success: '#34D399',             // Light green (success text)
        warning: '#FBBF24',             // Light amber (warning text)
        tertiary: colors.white,          // White (tertiary text)
        quaternary: colors.white,        // White (quaternary text)
      },
      icon: {
        primary: '#60A5FA',             // Light blue (primary icons)
        secondary: '#34D399',           // Light green (secondary icons)
        tertiary: '#A78BFA',            // Light purple (tertiary icons)
        quaternary: colors.white,        // White (quaternary icons)
        disabled: '#94A3B8',            // Medium blue-gray (disabled)
        error: '#F87171',               // Light red (error icons)
        success: '#34D399',             // Light green (success icons)
        warning: '#FBBF24',             // Light amber (warning icons)
      },
      border: {
        primary: '#60A5FA',             // Light blue (primary borders)
        secondary: '#34D399',           // Light green (secondary borders)
        error: '#F87171',               // Light red (error borders)
        tertiary: '#94A3B8',            // Medium blue-gray (tertiary borders)
        quaternary: '#60A5FA',          // Light blue (quaternary borders)
      },
      button: {
        primary: {
          background: '#2563EB',         // Bright blue (primary buttons)
          text: colors.white,            // White text
        },
        secondary: {
          background: '#059669',         // Dark green (secondary buttons)
          text: colors.white,            // White text
        },
        tertiary: {
          background: '#7C3AED',         // Dark purple (tertiary buttons)
          text: colors.white,            // White text
        },
        quaternary: {
          background: '#DC2626',         // Dark red (quaternary buttons)
          text: colors.white,            // White text
        },
        disabled: {
          background: '#374151',         // Dark gray (disabled)
          text: '#94A3B8',               // Medium blue-gray text
        },
      },
      status: {
        success: colors.secondary200,    // Medium teal (success status)
        error: colors.maroon200,         // Medium warm red (error status)
        warning: colors.accent200,       // Medium gold (warning status)
        info: colors.quaternary200,      // Medium orange (info status)
      },
      data: {
        // Primary data colors (8 colors - perfect for most visualizations)
        primary: [
          colors.dataDark.blue,
          colors.dataDark.green,
          colors.dataDark.orange,
          colors.dataDark.red,
          colors.dataDark.purple,
          colors.dataDark.teal,
          colors.dataDark.yellow,
          colors.dataDark.pink,
        ],
        // Extended data colors (16 colors - for complex visualizations)
        extended: [
          colors.dataDark.blue,
          colors.dataDark.green,
          colors.dataDark.orange,
          colors.dataDark.red,
          colors.dataDark.purple,
          colors.dataDark.teal,
          colors.dataDark.yellow,
          colors.dataDark.pink,
          colors.dataDark.indigo,
          colors.dataDark.emerald,
          colors.dataDark.amber,
          colors.dataDark.rose,
          colors.dataDark.cyan,
          colors.dataDark.lime,
          colors.dataDark.violet,
          colors.dataDark.fuchsia,
        ],
        // Semantic data colors
        semantic: {
          positive: colors.dataDark.green,
          negative: colors.dataDark.red,
          neutral: colors.dataDark.gray,
          highlight: colors.dataDark.blue,
        },
        // Data visualization background colors
        background: {
          primary: '#0A0E1A',           // Deep navy blue (matches main theme)
          secondary: '#1A2332',         // Rich dark blue
          grid: '#374151',              // Dark gray grid lines
          axis: '#6B7280',              // Medium gray axis lines
        },
      },
    };
  }
};

export const defaultTheme = generateTheme('light');
