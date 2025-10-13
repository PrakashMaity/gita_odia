import React from 'react';
import { StyleProp, View, ViewProps, ViewStyle } from 'react-native';
import { PARAMETERS } from '../../../constants';

export type SpacerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
export type SpacerDirection = 'horizontal' | 'vertical' | 'both';

export type ThemedSpacerProps = ViewProps & {
  size?: SpacerSize;
  direction?: SpacerDirection;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
};

const spacerSizes: Record<SpacerSize, number> = {
  xs: PARAMETERS.SIZES.spacing.xs,
  sm: PARAMETERS.SIZES.spacing.sm,
  md: PARAMETERS.SIZES.spacing.md,
  lg: PARAMETERS.SIZES.spacing.lg,
  xl: PARAMETERS.SIZES.spacing.xl,
  xxl: PARAMETERS.SIZES.spacing.xxl,
};

export function ThemedSpacer({ 
  size = 'md', 
  direction = 'vertical',
  style,
  children,
  ...otherProps 
}: ThemedSpacerProps) {
  const spacing = spacerSizes[size];

  const getSpacerStyle = (): StyleProp<ViewStyle> => {
    const baseStyle: ViewStyle = {
      backgroundColor: 'transparent',
    };

    // Apply spacing based on direction
    switch (direction) {
      case 'horizontal':
        baseStyle.width = spacing;
        baseStyle.height = 1;
        break;
      case 'vertical':
        baseStyle.height = spacing;
        baseStyle.width = '100%';
        break;
      case 'both':
        baseStyle.width = spacing;
        baseStyle.height = spacing;
        break;
    }

    // If style is an array, combine it with base style
    if (Array.isArray(style)) {
      return [baseStyle, ...style];
    }
    
    // If style is a single object, merge it
    return {
      ...baseStyle,
      ...(style as ViewStyle || {}),
    };
  };

  return (
    <View style={getSpacerStyle()} {...otherProps}>
      {children}
    </View>
  );
}

// Convenience components for common spacer sizes
export const XSSpacer: React.FC<Omit<ThemedSpacerProps, 'size'>> = (props) => (
  <ThemedSpacer size="xs" {...props} />
);

export const SMSpacer: React.FC<Omit<ThemedSpacerProps, 'size'>> = (props) => (
  <ThemedSpacer size="sm" {...props} />
);

export const MDSpacer: React.FC<Omit<ThemedSpacerProps, 'size'>> = (props) => (
  <ThemedSpacer size="md" {...props} />
);

export const LGSpacer: React.FC<Omit<ThemedSpacerProps, 'size'>> = (props) => (
  <ThemedSpacer size="lg" {...props} />
);

export const XLSpacer: React.FC<Omit<ThemedSpacerProps, 'size'>> = (props) => (
  <ThemedSpacer size="xl" {...props} />
);

export const XXLSpacer: React.FC<Omit<ThemedSpacerProps, 'size'>> = (props) => (
  <ThemedSpacer size="xxl" {...props} />
);

// Convenience components for directions
export const HorizontalSpacer: React.FC<Omit<ThemedSpacerProps, 'direction'>> = (props) => (
  <ThemedSpacer direction="horizontal" {...props} />
);

export const VerticalSpacer: React.FC<Omit<ThemedSpacerProps, 'direction'>> = (props) => (
  <ThemedSpacer direction="vertical" {...props} />
);

export const BothSpacer: React.FC<Omit<ThemedSpacerProps, 'direction'>> = (props) => (
  <ThemedSpacer direction="both" {...props} />
); 