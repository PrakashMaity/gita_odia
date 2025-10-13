import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
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
  
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const progressWidth = typeof width === 'number' ? width : 300; // Default width for SVG
  const progressBarWidth = progressWidth * clampedProgress;

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
    <View style={[styles.container, { width }, style]}>
      <Svg height={height} width={progressWidth} style={styles.svg}>
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
          width={progressWidth}
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
          <View style={styles.percentageText}>
            {Math.round(clampedProgress * 100)}%
          </View>
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
