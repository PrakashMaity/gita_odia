export interface Theme {
  // Background Colors
  background: {
    primary: string;
    secondary: string;
    card: string;
    tertiary: string;
    quaternary: string;
  };
  
  // Text Colors
  text: {
    primary: string;
    secondary: string;
    disabled: string;
    error: string;
    success: string;
    warning: string;
    tertiary: string;
    quaternary: string;
  };
  
  // Icon Colors
  icon: {
    primary: string;
    secondary: string;
    tertiary: string;
    quaternary: string;
    disabled: string;
    error: string;
    success: string;
    warning: string;
  };
  
  // Border Colors
  border: {
    primary: string;
    secondary: string;
    error: string;
    tertiary: string;
    quaternary: string;
  };
  
  // Button Colors
  button: {
    primary: {
      background: string;
      text: string;
    };
    secondary: {
      background: string;
      text: string;
    };
    tertiary: {
      background: string;
      text: string;
    };
    quaternary: {
      background: string;
      text: string;
    };
    disabled: {
      background: string;
      text: string;
    };
  };
  
  // Status Colors
  status: {
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  
  // Data Visualization Colors (for charts, graphs, data displays, etc.)
  data: {
    // Primary data colors (8 colors - perfect for most visualizations)
    primary: string[];
    // Extended data colors (16 colors - for complex visualizations)
    extended: string[];
    // Semantic data colors
    semantic: {
      positive: string;
      negative: string;
      neutral: string;
      highlight: string;
    };
    // Data visualization background colors
    background: {
      primary: string;
      secondary: string;
      grid: string;
      axis: string;
    };
  };
}