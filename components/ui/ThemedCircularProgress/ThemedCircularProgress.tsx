import { useThemeColors } from '@/hooks/useTheme';
import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

export interface ThemedCircularProgressProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  animated?: boolean;
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
}

export const ThemedCircularProgress: React.FC<ThemedCircularProgressProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  showPercentage = false,
  animated = true,
  style,
  children,
}) => {
  const theme = useThemeColors();
  
  const clampedProgress = Math.max(0, Math.min(1, progress));
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (clampedProgress * circumference);

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
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size} style={styles.svg}>
        <Defs>
          <LinearGradient id="circularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.progress} stopOpacity="0.8" />
            <Stop offset="100%" stopColor={colors.progress} stopOpacity="1" />
          </LinearGradient>
        </Defs>
        
        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={colors.background}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
        />
        
        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#circularGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
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
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  svg: {
    position: 'absolute',
  },
  percentageContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -10 }],
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  percentageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});
