import React from 'react';
import { Circle, Defs, G, Path, Pattern, RadialGradient, Rect, Stop, Svg } from 'react-native-svg';

export interface PatternProps {
  width: number | string;
  height: number | string;
  color1: string;
  color2: string;
  opacity?: number;
  style?: any;
}

// Helper function to create SVG with proper viewBox
const createSvg = (width: number | string, height: number | string, children: React.ReactNode, style?: any) => {
  // Use 400x200 viewBox for consistent pattern sizing
  const viewBoxWidth = 400;
  const viewBoxHeight = 200;
  
  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} 
      preserveAspectRatio="none"
      style={style}
    >
      {children}
    </Svg>
  );
};

// Geometric Dot Pattern
export const DotPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="dotPattern" patternUnits="userSpaceOnUse" width="30" height="30">
          <Circle cx="15" cy="15" r="2" fill={color1} opacity={opacity} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#dotPattern)" />
    </>,
    style
  );

// Wave Pattern (now Chariot Wheel)
export const WavePattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="wavePattern" patternUnits="userSpaceOnUse" width="55" height="55">
          <G transform="translate(27.5,27.5)">
            <Circle cx="0" cy="0" r="20" fill="none" stroke={color1} strokeWidth="2" opacity={opacity} />
            <Circle cx="0" cy="0" r="15" fill="none" stroke={color2} strokeWidth="1.5" opacity={opacity * 0.7} />
            <Circle cx="0" cy="0" r="8" fill="none" stroke={color1} strokeWidth="1" opacity={opacity * 0.5} />
            <Path
              d="M-20,0 L20,0 M0,-20 L0,20 M-14,-14 L14,14 M14,-14 L-14,14"
              stroke={color2}
              strokeWidth="1"
              opacity={opacity * 0.6}
            />
            <Circle cx="0" cy="0" r="3" fill={color1} opacity={opacity * 0.8} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#wavePattern)" />
    </>,
    style
  );

// Hexagon Pattern
export const HexagonPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="hexagonPattern" patternUnits="userSpaceOnUse" width="40" height="35">
          <Path
            d="M20,5 L30,12.5 L30,22.5 L20,30 L10,22.5 L10,12.5 Z"
            fill={color1}
            opacity={opacity}
          />
          <Path
            d="M20,10 L27.5,15 L27.5,20 L20,25 L12.5,20 L12.5,15 Z"
            fill={color2}
            opacity={opacity * 0.5}
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#hexagonPattern)" />
    </>,
    style
  );

// Grid Pattern
export const GridPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="gridPattern" patternUnits="userSpaceOnUse" width="25" height="25">
          <Path
            d="M 25 0 L 0 0 0 25"
            stroke={color1}
            strokeWidth="1"
            opacity={opacity}
          />
          <Circle cx="12.5" cy="12.5" r="1" fill={color2} opacity={opacity * 0.8} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#gridPattern)" />
    </>,
    style
  );

// Spiral Pattern
export const SpiralPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="spiralPattern" patternUnits="userSpaceOnUse" width="50" height="50">
          <Path
            d="M25,25 Q25,15 35,15 Q45,15 45,25 Q45,35 35,35 Q25,35 25,25"
            stroke={color1}
            strokeWidth="2"
            fill="none"
            opacity={opacity}
          />
          <Circle cx="25" cy="25" r="3" fill={color2} opacity={opacity * 0.6} />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#spiralPattern)" />
    </>,
    style
  );

// Mandala Pattern
export const MandalaPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="mandalaPattern" patternUnits="userSpaceOnUse" width="60" height="60">
          <G transform="translate(30,30)">
            <Circle cx="0" cy="0" r="25" fill="none" stroke={color1} strokeWidth="1" opacity={opacity} />
            <Circle cx="0" cy="0" r="18" fill="none" stroke={color2} strokeWidth="1" opacity={opacity * 0.7} />
            <Circle cx="0" cy="0" r="12" fill="none" stroke={color1} strokeWidth="1" opacity={opacity * 0.5} />
            <Circle cx="0" cy="0" r="6" fill={color2} opacity={opacity * 0.3} />
            <Path
              d="M-18,-18 L18,18 M18,-18 L-18,18"
              stroke={color1}
              strokeWidth="1"
              opacity={opacity * 0.4}
            />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#mandalaPattern)" />
    </>,
    style
  );

// Gradient Dot Pattern
export const GradientDotPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <RadialGradient id="gradientDot" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor={color1} stopOpacity={opacity} />
          <Stop offset="100%" stopColor={color2} stopOpacity={opacity * 0.3} />
        </RadialGradient>
        <Pattern id="gradientDotPattern" patternUnits="userSpaceOnUse" width="30" height="30">
          <Circle cx="15" cy="15" r="8" fill="url(#gradientDot)" />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#gradientDotPattern)" />
    </>,
    style
  );

// Organic Blob Pattern
export const BlobPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="blobPattern" patternUnits="userSpaceOnUse" width="70" height="70">
          <Path
            d="M35,15 Q50,10 60,25 Q65,40 55,55 Q40,60 25,55 Q10,50 15,35 Q20,20 35,15 Z"
            fill={color1}
            opacity={opacity}
          />
          <Path
            d="M35,25 Q45,23 50,33 Q47,43 40,50 Q30,47 27,40 Q23,30 35,25 Z"
            fill={color2}
            opacity={opacity * 0.6}
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#blobPattern)" />
    </>,
    style
  );

// Sacred Geometry Pattern
export const SacredGeometryPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="sacredGeometryPattern" patternUnits="userSpaceOnUse" width="60" height="60">
          <G transform="translate(30,30)">
            <Path
              d="M-20,-20 L20,20 M20,-20 L-20,20 M-20,0 L20,0 M0,-20 L0,20"
              stroke={color1}
              strokeWidth="1"
              opacity={opacity}
            />
            <Circle cx="0" cy="0" r="15" fill="none" stroke={color2} strokeWidth="1" opacity={opacity * 0.7} />
            <Circle cx="0" cy="0" r="8" fill={color1} opacity={opacity * 0.3} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#sacredGeometryPattern)" />
    </>,
    style
  );

// Flowing Lines Pattern
export const FlowingLinesPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="flowingLinesPattern" patternUnits="userSpaceOnUse" width="60" height="60">
          <Path
            d="M0,30 Q15,20 30,30 T60,30"
            stroke={color1}
            strokeWidth="2"
            fill="none"
            opacity={opacity}
          />
          <Path
            d="M0,35 Q15,25 30,35 T60,35"
            stroke={color2}
            strokeWidth="1.5"
            fill="none"
            opacity={opacity * 0.7}
          />
          <Path
            d="M0,25 Q15,15 30,25 T60,25"
            stroke={color1}
            strokeWidth="1"
            fill="none"
            opacity={opacity * 0.5}
          />
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#flowingLinesPattern)" />
    </>,
    style
  );

// Conch Shell (Shankha) Pattern
export const ConchPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="conchPattern" patternUnits="userSpaceOnUse" width="50" height="50">
          <G transform="translate(25,25)">
            <Path
              d="M-15,-8 Q-20,-12 -18,-18 Q-15,-22 -10,-20 Q-5,-18 -8,-12 Q-10,-8 -15,-8 Z"
              fill={color1}
              opacity={opacity}
            />
            <Path
              d="M-12,-6 Q-16,-9 -15,-14 Q-12,-17 -8,-15 Q-4,-13 -6,-9 Q-8,-6 -12,-6 Z"
              fill={color2}
              opacity={opacity * 0.6}
            />
            <Path
              d="M-10,-4 Q-13,-6 -12,-10 Q-10,-12 -7,-11 Q-4,-10 -5,-7 Q-6,-4 -10,-4 Z"
              fill={color1}
              opacity={opacity * 0.4}
            />
            <Circle cx="0" cy="0" r="2" fill={color2} opacity={opacity * 0.8} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#conchPattern)" />
    </>,
    style
  );

// Bow and Arrow Pattern
export const BowArrowPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="bowArrowPattern" patternUnits="userSpaceOnUse" width="60" height="60">
          <G transform="translate(30,30)">
            <Path
              d="M-20,-15 Q0,-25 20,-15 Q0,-5 -20,-15"
              stroke={color1}
              strokeWidth="2"
              fill="none"
              opacity={opacity}
            />
            <Path
              d="M-15,0 L15,0"
              stroke={color2}
              strokeWidth="1.5"
              opacity={opacity * 0.8}
            />
            <Path
              d="M-12,-2 L-8,-2 M-12,2 L-8,2"
              stroke={color1}
              strokeWidth="1"
              opacity={opacity * 0.6}
            />
            <Circle cx="0" cy="0" r="3" fill={color2} opacity={opacity * 0.7} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#bowArrowPattern)" />
    </>,
    style
  );

// Chariot Wheel (Rath Chakra) Pattern
export const ChariotWheelPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="chariotWheelPattern" patternUnits="userSpaceOnUse" width="55" height="55">
          <G transform="translate(27.5,27.5)">
            <Circle cx="0" cy="0" r="20" fill="none" stroke={color1} strokeWidth="2" opacity={opacity} />
            <Circle cx="0" cy="0" r="15" fill="none" stroke={color2} strokeWidth="1.5" opacity={opacity * 0.7} />
            <Circle cx="0" cy="0" r="8" fill="none" stroke={color1} strokeWidth="1" opacity={opacity * 0.5} />
            <Path
              d="M-20,0 L20,0 M0,-20 L0,20 M-14,-14 L14,14 M14,-14 L-14,14"
              stroke={color2}
              strokeWidth="1"
              opacity={opacity * 0.6}
            />
            <Circle cx="0" cy="0" r="3" fill={color1} opacity={opacity * 0.8} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#chariotWheelPattern)" />
    </>,
    style
  );

// Lotus (Padma) Pattern
export const LotusPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="lotusPattern" patternUnits="userSpaceOnUse" width="50" height="50">
          <G transform="translate(25,25)">
            <Path
              d="M0,-18 Q-8,-12 -8,-6 Q-8,0 -4,3 Q0,6 4,3 Q8,0 8,-6 Q8,-12 0,-18 Z"
              fill={color1}
              opacity={opacity}
            />
            <Path
              d="M-6,-12 Q-10,-8 -10,-4 Q-10,0 -6,2 Q-3,4 0,2 Q3,4 6,2 Q10,0 10,-4 Q10,-8 6,-12 Q3,-15 0,-15 Q-3,-15 -6,-12 Z"
              fill={color2}
              opacity={opacity * 0.7}
            />
            <Path
              d="M-4,-8 Q-6,-6 -6,-3 Q-6,0 -4,1 Q-2,2 0,1 Q2,2 4,1 Q6,0 6,-3 Q6,-6 4,-8 Q2,-10 0,-10 Q-2,-10 -4,-8 Z"
              fill={color1}
              opacity={opacity * 0.5}
            />
            <Circle cx="0" cy="0" r="2" fill={color2} opacity={opacity * 0.9} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#lotusPattern)" />
    </>,
    style
  );

// Trishul (Trident) Pattern
export const TrishulPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="trishulPattern" patternUnits="userSpaceOnUse" width="45" height="45">
          <G transform="translate(22.5,22.5)">
            <Path
              d="M0,-18 L0,18 M-8,-18 L-8,-12 M8,-18 L8,-12 M-6,-12 L6,-12"
              stroke={color1}
              strokeWidth="2"
              opacity={opacity}
            />
            <Path
              d="M-6,-12 L-4,-10 M-2,-12 L-2,-10 M2,-12 L2,-10 M4,-12 L6,-10"
              stroke={color2}
              strokeWidth="1.5"
              opacity={opacity * 0.7}
            />
            <Circle cx="0" cy="0" r="3" fill={color1} opacity={opacity * 0.6} />
            <Path
              d="M-3,0 L3,0 M0,-3 L0,3"
              stroke={color2}
              strokeWidth="1"
              opacity={opacity * 0.8}
            />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#trishulPattern)" />
    </>,
    style
  );

// OM Symbol Pattern
export const OmPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="omPattern" patternUnits="userSpaceOnUse" width="50" height="50">
          <G transform="translate(25,25)">
            <Path
              d="M-15,-8 Q-20,-5 -18,0 Q-16,5 -12,3 Q-8,1 -10,-2 Q-12,-5 -15,-8 Z"
              fill={color1}
              opacity={opacity}
            />
            <Path
              d="M-8,0 Q-12,3 -10,8 Q-8,13 -4,11 Q0,9 -2,6 Q-4,3 -8,0 Z"
              fill={color2}
              opacity={opacity * 0.7}
            />
            <Path
              d="M0,5 Q-3,8 -1,12 Q1,16 5,14 Q9,12 7,9 Q5,6 0,5 Z"
              fill={color1}
              opacity={opacity * 0.5}
            />
            <Circle cx="8" cy="0" r="3" fill={color2} opacity={opacity * 0.8} />
            <Path
              d="M6,-2 L10,-2 M6,2 L10,2"
              stroke={color1}
              strokeWidth="1"
              opacity={opacity * 0.6}
            />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#omPattern)" />
    </>,
    style
  );

// Divine Chakra Pattern
export const DivineChakraPattern: React.FC<PatternProps> = ({ width, height, color1, color2, opacity = 0.1, style }) => 
  createSvg(width, height,
    <>
      <Defs>
        <Pattern id="divineChakraPattern" patternUnits="userSpaceOnUse" width="60" height="60">
          <G transform="translate(30,30)">
            <Circle cx="0" cy="0" r="25" fill="none" stroke={color1} strokeWidth="2" opacity={opacity} />
            <Circle cx="0" cy="0" r="20" fill="none" stroke={color2} strokeWidth="1.5" opacity={opacity * 0.7} />
            <Circle cx="0" cy="0" r="15" fill="none" stroke={color1} strokeWidth="1" opacity={opacity * 0.5} />
            <Path
              d="M-25,0 L25,0 M0,-25 L0,25 M-18,-18 L18,18 M18,-18 L-18,18"
              stroke={color2}
              strokeWidth="1"
              opacity={opacity * 0.6}
            />
            <Path
              d="M-12,-12 L12,12 M12,-12 L-12,12 M-17,-7 L17,7 M17,-7 L-17,7 M-7,-17 L7,17 M7,-17 L-7,17"
              stroke={color1}
              strokeWidth="0.8"
              opacity={opacity * 0.4}
            />
            <Circle cx="0" cy="0" r="5" fill={color2} opacity={opacity * 0.9} />
          </G>
        </Pattern>
      </Defs>
      <Rect x="0" y="0" width="400" height="200" fill="url(#divineChakraPattern)" />
    </>,
    style
  );

export type PatternType = 
  | 'dot'
  | 'wave'
  | 'hexagon'
  | 'grid'
  | 'spiral'
  | 'mandala'
  | 'gradientDot'
  | 'blob'
  | 'sacredGeometry'
  | 'flowingLines'
  | 'conch'
  | 'bowArrow'
  | 'chariotWheel'
  | 'lotus'
  | 'trishul'
  | 'om'
  | 'divineChakra'
  | 'none';

export const patternComponents = {
  dot: DotPattern,
  wave: WavePattern,
  hexagon: HexagonPattern,
  grid: GridPattern,
  spiral: SpiralPattern,
  mandala: MandalaPattern,
  gradientDot: GradientDotPattern,
  blob: BlobPattern,
  sacredGeometry: SacredGeometryPattern,
  flowingLines: FlowingLinesPattern,
  conch: ConchPattern,
  bowArrow: BowArrowPattern,
  chariotWheel: ChariotWheelPattern,
  lotus: LotusPattern,
  trishul: TrishulPattern,
  om: OmPattern,
  divineChakra: DivineChakraPattern,
};