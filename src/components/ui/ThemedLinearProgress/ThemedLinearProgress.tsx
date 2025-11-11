import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

export interface ThemedLinearProgressProps {
  progress: number; // 0 to 1
  height?: number;
  width?: number | string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const ThemedLinearProgress: React.FC<ThemedLinearProgressProps> = ({
  progress,
  height = 8,
  width = '100%',
  variant = 'primary',
  showPercentage = false,
  animated = true,
  style,
  children,
}) => {
  const theme = useThemeColors();
  const [measuredWidth, setMeasuredWidth] = React.useState(0);

  const clampedProgress = Math.max(0, Math.min(1, progress));
  const resolvedWidth = React.useMemo(() => {
    if (typeof width === 'number') {
      return width;
    }

    if (typeof width === 'string') {
      if (width.endsWith('%') || width === 'auto') {
        return measuredWidth;
      }

      const parsed = Number(width);
      if (!Number.isNaN(parsed)) {
        return parsed;
      }
    }

    return measuredWidth;
  }, [width, measuredWidth]);
  const progressBarWidth = resolvedWidth * clampedProgress;

  const handleLayout = React.useCallback(
    (event: any) => {
      if (typeof width === 'number') {
        return;
      }

      const layoutWidth = event?.nativeEvent?.layout?.width;

      if (typeof layoutWidth === 'number' && layoutWidth > 0 && layoutWidth !== measuredWidth) {
        setMeasuredWidth(layoutWidth);
      }
    },
    [width, measuredWidth]
  );

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.background.card,
          progress: theme.icon.primary,
        };
      case 'secondary':
        return {
          background: theme.background.card,
          progress: theme.icon.secondary,
        };
      case 'success':
        return {
          background: theme.background.card,
          progress: theme.status.success,
        };
      case 'warning':
        return {
          background: theme.background.card,
          progress: theme.status.warning,
        };
      case 'error':
        return {
          background: theme.background.card,
          progress: theme.status.error,
        };
      default:
        return {
          background: theme.background.card,
          progress: theme.icon.primary,
        };
    }
  };

  const colors = getVariantColors();

  return (
    <View
      onLayout={handleLayout}
      style={[
        styles.container,
        {
          height,
          width: width as any,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <Svg height={height} width={resolvedWidth} style={styles.svg}>
        <Defs>
          <LinearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={colors.progress} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.progress} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background */}
        <Rect
          x={0}
          y={0}
          width={resolvedWidth}
          height={height}
          rx={height / 2}
          ry={height / 2}
          fill={colors.background}
        />
        
        {/* Progress bar */}
        <Rect
          x={0}
          y={0}
          width={progressBarWidth}
          height={height}
          rx={height / 2}
          ry={height / 2}
          fill="url(#progressGradient)"
        />
      </Svg>
      
      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>
            {Math.round(clampedProgress * 100)}%
          </Text>
        </View>
      )}
      
      {children && (
        <View style={styles.content}>
          {children}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  svg: {
    width: '100%',
  },
  percentageContainer: {
    position: 'absolute',
    top: -25,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  percentageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
