import { Theme } from '../interface/color.interface';
import { colors } from './tint';

export type { Theme };
export type ThemeMode = 'light' | 'dark' | 'system';

export const generateTheme = (mode: ThemeMode): Theme => {
  if (mode === 'light') {
    return {
      background: {
        primary: colors.primary600,        // Light saffron cream
        secondary: colors.primary500,      // Light saffron
        card: colors.primary400,           // Golden saffron
        tertiary: colors.primary300,       // Bright orange
        quaternary: colors.primary200,     // Light orange
      },
      text: {
        primary: colors.secondary50,       // Very dark brown (high contrast)
        secondary: colors.secondary100,    // Dark brown (better contrast)
        disabled: colors.secondary300,     // Medium brown (more visible)
        error: colors.tertiary50,          // Very deep red (high contrast)
        success: colors.quaternary50,      // Very dark green (high contrast)
        warning: colors.accent50,          // Dark orange (high contrast)
        tertiary: colors.tertiary100,      // Deep red (tertiary text)
        quaternary: colors.tertiary200,    // Medium red (quaternary text)
      },
      icon: {
        primary: colors.accent50,          // Dark orange (high contrast)
        secondary: colors.accent100,       // Deep orange (high contrast)
        tertiary: colors.tertiary50,       // Very deep red (high contrast)
        quaternary: colors.quaternary50,   // Very dark green (high contrast)
        disabled: colors.primary300,       // Bright orange (more visible)
        error: colors.tertiary50,          // Very deep red (high contrast)
        success: colors.quaternary50,      // Very dark green (high contrast)
        warning: colors.accent50,          // Dark orange (high contrast)
      },
      border: {
        primary: colors.accent50,          // Dark orange (high contrast)
        secondary: colors.accent100,       // Deep orange (high contrast)
        error: colors.tertiary50,          // Very deep red (high contrast)
        tertiary: colors.secondary200,     // Medium brown (better contrast)
        quaternary: colors.accent50,       // Dark orange (high contrast)
      },
      button: {
        primary: {
          background: colors.accent100,    // Deep orange
          text: colors.white,              // White text
        },
        secondary: {
          background: colors.accent50,     // Dark orange
          text: colors.white,              // White text
        },
        tertiary: {
          background: colors.secondary200, // Rich brown
          text: colors.white,              // White text
        },
        quaternary: {
          background: colors.tertiary100,  // Deep red
          text: colors.white,              // White text
        },
        disabled: {
          background: colors.secondary400, // Light brown
          text: colors.secondary300,       // Medium brown text
        },
      },
      status: {
        success: colors.quaternary50,      // Very dark green (high contrast)
        error: colors.tertiary50,          // Very deep red (high contrast)
        warning: colors.accent50,          // Dark orange (high contrast)
        info: colors.tertiary100,          // Deep red (info status)
      },
      data: {
        // Primary data colors (8 colors - perfect for most visualizations)
        primary: [
          colors.dataLight.blue,
          colors.dataLight.green,
          colors.dataLight.orange,
          colors.dataLight.red,
          colors.dataLight.purple,
          colors.dataLight.teal,
          colors.dataLight.yellow,
          colors.dataLight.pink,
        ],
        // Extended data colors (16 colors - for complex visualizations)
        extended: [
          colors.dataLight.blue,
          colors.dataLight.green,
          colors.dataLight.orange,
          colors.dataLight.red,
          colors.dataLight.purple,
          colors.dataLight.teal,
          colors.dataLight.yellow,
          colors.dataLight.pink,
          colors.dataLight.indigo,
          colors.dataLight.emerald,
          colors.dataLight.amber,
          colors.dataLight.rose,
          colors.dataLight.cyan,
          colors.dataLight.lime,
          colors.dataLight.violet,
          colors.dataLight.fuchsia,
        ],
        // Semantic data colors
        semantic: {
          positive: colors.dataLight.green,
          negative: colors.dataLight.red,
          neutral: colors.dataLight.gray,
          highlight: colors.dataLight.blue,
        },
        // Data visualization background colors
        background: {
          primary: colors.primary600,      // Light saffron cream
          secondary: colors.primary500,    // Light saffron
          grid: colors.primary400,         // Golden saffron grid lines
          axis: colors.secondary300,       // Rich brown axis lines
        },
      },
    };
  } else {
    // Dark mode theme
    return {
      background: {
        primary: colors.black900,          // Deep navy blue
        secondary: colors.black800,        // Rich dark blue
        card: colors.black700,             // Medium dark blue
        tertiary: colors.secondary50,      // Deep secondary color
        quaternary: colors.primary200,     // Bright primary color
      },
      text: {
        primary: colors.white,             // White (main text)
        secondary: colors.primary700,      // Light color (secondary text)
        disabled: colors.secondary400,     // Medium color (disabled)
        error: colors.tertiary300,         // Light red (error text)
        success: colors.quaternary300,     // Light green (success text)
        warning: colors.accent300,         // Light amber (warning text)
        tertiary: colors.white,            // White (tertiary text)
        quaternary: colors.white,          // White (quaternary text)
      },
      icon: {
        primary: colors.primary300,        // Light primary (primary icons)
        secondary: colors.quaternary300,   // Light green (secondary icons)
        tertiary: colors.tertiary300,      // Light purple (tertiary icons)
        quaternary: colors.white,          // White (quaternary icons)
        disabled: colors.secondary400,     // Medium color (disabled)
        error: colors.tertiary300,         // Light red (error icons)
        success: colors.quaternary300,     // Light green (success icons)
        warning: colors.accent300,         // Light amber (warning icons)
      },
      border: {
        primary: colors.primary300,        // Light primary (primary borders)
        secondary: colors.quaternary300,   // Light green (secondary borders)
        error: colors.tertiary300,         // Light red (error borders)
        tertiary: colors.secondary400,     // Medium color (tertiary borders)
        quaternary: colors.primary300,     // Light primary (quaternary borders)
      },
      button: {
        primary: {
          background: colors.primary200,   // Bright primary
          text: colors.white,              // White text
        },
        secondary: {
          background: colors.quaternary100, // Dark green
          text: colors.white,              // White text
        },
        tertiary: {
          background: colors.tertiary100,  // Dark purple
          text: colors.white,              // White text
        },
        quaternary: {
          background: colors.accent100,    // Dark amber
          text: colors.white,              // White text
        },
        disabled: {
          background: colors.black700,     // Dark gray
          text: colors.secondary400,       // Medium color text
        },
      },
      status: {
        success: colors.quaternary200,     // Medium green (success status)
        error: colors.tertiary200,         // Medium red (error status)
        warning: colors.accent200,         // Medium amber (warning status)
        info: colors.primary200,           // Medium primary (info status)
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
          primary: colors.black900,        // Deep navy blue
          secondary: colors.black800,      // Rich dark blue
          grid: colors.black700,           // Dark gray grid lines
          axis: colors.black600,           // Medium gray axis lines
        },
      },
    };
  }
};

export const defaultTheme = generateTheme('light');
