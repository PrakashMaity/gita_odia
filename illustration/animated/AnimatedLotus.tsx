import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import Svg, { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

// Create animated G component
const AnimatedG = Animated.createAnimatedComponent(G);

const AnimatedLotus: React.FC = () => {
  // Animated values
  const outerRotation = useRef(new Animated.Value(0)).current;
  const innerRotation = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    // Outer lotus rotation
    Animated.loop(
      Animated.timing(outerRotation, {
        toValue: 360,
        duration: 120000, // 120s
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Inner lotus rotation (reverse)
    Animated.loop(
      Animated.timing(innerRotation, {
        toValue: -360,
        duration: 200000, // 200s
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Glow pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.3, duration: 4000, useNativeDriver: false }),
        Animated.timing(glowOpacity, { toValue: 0.35, duration: 4000, useNativeDriver: false }),
      ])
    ).start();
  }, [outerRotation, innerRotation, glowOpacity]);

  return (
    <Svg width="100%" height="100%" viewBox="0 0 1440 900">
      <Defs>
        <LinearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFE6A7" />
          <Stop offset="100%" stopColor="#FFF7EF" />
        </LinearGradient>

        <LinearGradient id="petalGrad" x1="0" y1="-60" x2="0" y2="0">
          <Stop offset="0%" stopColor="#FFD166" />
          <Stop offset="100%" stopColor="#FFE6A7" />
        </LinearGradient>

        <RadialGradient id="lotusGlow" cx="50%" cy="40%" r="50%">
          <Stop offset="0%" stopColor="#FFF9F0" stopOpacity={glowOpacity as any} />
          <Stop offset="100%" stopColor="#FFF9F0" stopOpacity={0} />
        </RadialGradient>
      </Defs>

      {/* Background */}
      <G>
        <Path d="M0 0H1440V900H0Z" fill="url(#bgGrad)" />
      </G>

      {/* Glow */}
      <Ellipse cx={720} cy={400} rx={550} ry={250} fill="url(#lotusGlow)" />

      {/* Central lotus */}
      <G x={720} y={450}>
        {/* Outer petals */}
        <AnimatedG rotation={outerRotation} origin="0,0">
          {[...Array(12)].map((_, i) => (
            <Path
              key={`outer-${i}`}
              d="M0,-60 C18,-45 18,-15 0,0 C-18,-15 -18,-45 0,-60Z"
              fill="url(#petalGrad)"
              stroke="#E6C78A"
              strokeWidth={1.5}
              transform={`rotate(${i * 30}) scale(3)`}
            />
          ))}
        </AnimatedG>

        {/* Inner petals */}
        <AnimatedG rotation={innerRotation} origin="0,0">
          {[...Array(8)].map((_, i) => (
            <Path
              key={`inner-${i}`}
              d="M0,-60 C18,-45 18,-15 0,0 C-18,-15 -18,-45 0,-60Z"
              fill="url(#petalGrad)"
              stroke="#E6C78A"
              strokeWidth={1.5}
              transform={`rotate(${15 + i * 45}) scale(1.5)`}
            />
          ))}
        </AnimatedG>

        {/* Center circle */}
        <Circle r={12} fill="#FFD166" />
      </G>
    </Svg>
  );
};

export default AnimatedLotus;
