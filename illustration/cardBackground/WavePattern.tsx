import { useThemeColors } from '@/hooks/useTheme';
import * as React from "react";
import Svg, { Circle, G, Path, Rect } from "react-native-svg";

interface WavePatternProps {
  width?: number;
  height?: number;
  opacity?: number;
}

const WavePattern: React.FC<WavePatternProps> = ({ 
  width = 400, 
  height = 400, 
  opacity = 0.15 
}) => {
  const theme = useThemeColors();
  
  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', zIndex: -1 }}
    >
      {/* Transparent background so the pattern shows through */}
      <Rect fill="transparent" width={width} height={height} />
      
      {/* Main Chariot Wheel Pattern */}
      <G transform={`translate(${width/2}, ${height/2})`}>
        {/* Outer circle */}
        <Circle 
          cx="0" 
          cy="0" 
          r={Math.min(width, height) * 0.4} 
          fill="none" 
          stroke={theme.border.primary} 
          strokeWidth="2" 
          opacity={opacity}
        />
        
        {/* Middle circle */}
        <Circle 
          cx="0" 
          cy="0" 
          r={Math.min(width, height) * 0.3} 
          fill="none" 
          stroke={theme.border.secondary} 
          strokeWidth="1.5" 
          opacity={opacity * 0.7}
        />
        
        {/* Inner circle */}
        <Circle 
          cx="0" 
          cy="0" 
          r={Math.min(width, height) * 0.15} 
          fill="none" 
          stroke={theme.border.tertiary} 
          strokeWidth="1" 
          opacity={opacity * 0.5}
        />
        
        {/* Cross spokes */}
        <Path
          d={`M-${Math.min(width, height) * 0.4},0 L${Math.min(width, height) * 0.4},0 M0,-${Math.min(width, height) * 0.4} L0,${Math.min(width, height) * 0.4}`}
          stroke={theme.border.secondary}
          strokeWidth="1"
          opacity={opacity * 0.6}
        />
        
        {/* Diagonal spokes */}
        <Path
          d={`M-${Math.min(width, height) * 0.28},-${Math.min(width, height) * 0.28} L${Math.min(width, height) * 0.28},${Math.min(width, height) * 0.28} M${Math.min(width, height) * 0.28},-${Math.min(width, height) * 0.28} L-${Math.min(width, height) * 0.28},${Math.min(width, height) * 0.28}`}
          stroke={theme.border.secondary}
          strokeWidth="1"
          opacity={opacity * 0.6}
        />
        
        {/* Center dot */}
        <Circle 
          cx="0" 
          cy="0" 
          r={Math.min(width, height) * 0.05} 
          fill={theme.border.primary} 
          opacity={opacity * 0.8}
        />
      </G>

      {/* Small Chariot Wheels - Top Left */}
      <G transform={`translate(${width * 0.15}, ${height * 0.15})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.08} fill="none" stroke={theme.border.secondary} strokeWidth="1" opacity={opacity * 0.4} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.06} fill="none" stroke={theme.border.tertiary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Path d={`M-${Math.min(width, height) * 0.08},0 L${Math.min(width, height) * 0.08},0 M0,-${Math.min(width, height) * 0.08} L0,${Math.min(width, height) * 0.08}`} stroke={theme.border.tertiary} strokeWidth="0.5" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.015} fill={theme.border.secondary} opacity={opacity * 0.5} />
      </G>

      {/* Small Chariot Wheels - Top Right */}
      <G transform={`translate(${width * 0.85}, ${height * 0.15})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.08} fill="none" stroke={theme.border.secondary} strokeWidth="1" opacity={opacity * 0.4} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.06} fill="none" stroke={theme.border.tertiary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Path d={`M-${Math.min(width, height) * 0.08},0 L${Math.min(width, height) * 0.08},0 M0,-${Math.min(width, height) * 0.08} L0,${Math.min(width, height) * 0.08}`} stroke={theme.border.tertiary} strokeWidth="0.5" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.015} fill={theme.border.secondary} opacity={opacity * 0.5} />
      </G>

      {/* Small Chariot Wheels - Bottom Left */}
      <G transform={`translate(${width * 0.15}, ${height * 0.85})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.08} fill="none" stroke={theme.border.secondary} strokeWidth="1" opacity={opacity * 0.4} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.06} fill="none" stroke={theme.border.tertiary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Path d={`M-${Math.min(width, height) * 0.08},0 L${Math.min(width, height) * 0.08},0 M0,-${Math.min(width, height) * 0.08} L0,${Math.min(width, height) * 0.08}`} stroke={theme.border.tertiary} strokeWidth="0.5" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.015} fill={theme.border.secondary} opacity={opacity * 0.5} />
      </G>

      {/* Small Chariot Wheels - Bottom Right */}
      <G transform={`translate(${width * 0.85}, ${height * 0.85})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.08} fill="none" stroke={theme.border.secondary} strokeWidth="1" opacity={opacity * 0.4} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.06} fill="none" stroke={theme.border.tertiary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Path d={`M-${Math.min(width, height) * 0.08},0 L${Math.min(width, height) * 0.08},0 M0,-${Math.min(width, height) * 0.08} L0,${Math.min(width, height) * 0.08}`} stroke={theme.border.tertiary} strokeWidth="0.5" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.015} fill={theme.border.secondary} opacity={opacity * 0.5} />
      </G>

      {/* Small Chariot Wheels - Center Left */}
      <G transform={`translate(${width * 0.1}, ${height * 0.5})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.06} fill="none" stroke={theme.border.tertiary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.04} fill="none" stroke={theme.border.primary} strokeWidth="0.6" opacity={opacity * 0.2} />
        <Path d={`M-${Math.min(width, height) * 0.06},0 L${Math.min(width, height) * 0.06},0 M0,-${Math.min(width, height) * 0.06} L0,${Math.min(width, height) * 0.06}`} stroke={theme.border.primary} strokeWidth="0.4" opacity={opacity * 0.2} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.01} fill={theme.border.tertiary} opacity={opacity * 0.4} />
      </G>

      {/* Small Chariot Wheels - Center Right */}
      <G transform={`translate(${width * 0.9}, ${height * 0.5})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.06} fill="none" stroke={theme.border.tertiary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.04} fill="none" stroke={theme.border.primary} strokeWidth="0.6" opacity={opacity * 0.2} />
        <Path d={`M-${Math.min(width, height) * 0.06},0 L${Math.min(width, height) * 0.06},0 M0,-${Math.min(width, height) * 0.06} L0,${Math.min(width, height) * 0.06}`} stroke={theme.border.primary} strokeWidth="0.4" opacity={opacity * 0.2} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.01} fill={theme.border.tertiary} opacity={opacity * 0.4} />
      </G>

      {/* Small Chariot Wheels - Top Center */}
      <G transform={`translate(${width * 0.5}, ${height * 0.1})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.05} fill="none" stroke={theme.border.secondary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.035} fill="none" stroke={theme.border.tertiary} strokeWidth="0.6" opacity={opacity * 0.2} />
        <Path d={`M-${Math.min(width, height) * 0.05},0 L${Math.min(width, height) * 0.05},0 M0,-${Math.min(width, height) * 0.05} L0,${Math.min(width, height) * 0.05}`} stroke={theme.border.tertiary} strokeWidth="0.4" opacity={opacity * 0.2} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.01} fill={theme.border.secondary} opacity={opacity * 0.4} />
      </G>

      {/* Small Chariot Wheels - Bottom Center */}
      <G transform={`translate(${width * 0.5}, ${height * 0.9})`}>
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.05} fill="none" stroke={theme.border.secondary} strokeWidth="0.8" opacity={opacity * 0.3} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.035} fill="none" stroke={theme.border.tertiary} strokeWidth="0.6" opacity={opacity * 0.2} />
        <Path d={`M-${Math.min(width, height) * 0.05},0 L${Math.min(width, height) * 0.05},0 M0,-${Math.min(width, height) * 0.05} L0,${Math.min(width, height) * 0.05}`} stroke={theme.border.tertiary} strokeWidth="0.4" opacity={opacity * 0.2} />
        <Circle cx="0" cy="0" r={Math.min(width, height) * 0.01} fill={theme.border.secondary} opacity={opacity * 0.4} />
      </G>
    </Svg>
  );
};

export default WavePattern;
