import { colors } from '@/rootconstants/tint';
import { Theme } from '@/types/color.interface';

export type { Theme };

export const defaultTheme: Theme = {
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
    semantic: {
      positive: colors.dataLight.green,
      negative: colors.dataLight.red,
      neutral: colors.dataLight.gray,
      highlight: colors.dataLight.blue,
    },
    background: {
      primary: colors.primary600,      // Light saffron cream
      secondary: colors.primary500,    // Light saffron
      grid: colors.primary400,         // Golden saffron grid lines
      axis: colors.secondary300,       // Rich brown axis lines
    },
  },
};
