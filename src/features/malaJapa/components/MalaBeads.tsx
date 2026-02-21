import { Text } from '@/components/ui/text';
import { getLanguageFonts } from '@/types/font.interface';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const MALA_SIZE = Math.min(width * 0.85, 360);
const BEAD_SIZE = 36;
const VISUAL_BEAD_COUNT = 12;
const MALA_RADIUS = MALA_SIZE / 2 - BEAD_SIZE * 1.5;
const BACKDROP_SIZE = MALA_SIZE + 24;

type MantraType = 'hareKrishna' | 'omNamah' | 'gitaDhyana' | 'custom';

interface MalaBeadsProps {
  beadCount: 27 | 54 | 108;
  currentBead: number;
  onBeadTap: () => void;
  selectedMantra: MantraType;
}

export const MalaBeads: React.FC<MalaBeadsProps> = ({
  beadCount,
  currentBead,
  onBeadTap,
  selectedMantra,
}) => {
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const fonts = getLanguageFonts();

  // Animate rotation when bead changes
  useEffect(() => {
    const degreesPerBead = 360 / beadCount;
    const targetRotation = currentBead * degreesPerBead;
    Animated.spring(rotationAnim, {
      toValue: targetRotation,
      tension: 50,
      friction: 7,
      useNativeDriver: true,
    }).start();
  }, [currentBead, beadCount, rotationAnim]);

  // Calculate positions for beads in a circle
  const getBeadPosition = (index: number, total: number) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const x = MALA_RADIUS * Math.cos(angle) + MALA_SIZE / 2;
    const y = MALA_RADIUS * Math.sin(angle) + MALA_SIZE / 2;
    return { x, y };
  };

  // Handle tap
  const handleTap = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 300,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
    onBeadTap();
  };

  // Render beads
  const renderBeads = () => {
    const beads = [];
    const progress = currentBead / Math.max(beadCount - 1, 1);
    const activeVisualBead = Math.min(
      Math.floor(progress * VISUAL_BEAD_COUNT),
      VISUAL_BEAD_COUNT - 1
    );

    for (let i = 0; i < VISUAL_BEAD_COUNT; i++) {
      const position = getBeadPosition(i, VISUAL_BEAD_COUNT);
      const isActive = i === activeVisualBead;
      const isCompleted = i < activeVisualBead;

      beads.push(
        <Animated.View
          key={i}
          style={[
            styles.bead,
            {
              left: position.x - BEAD_SIZE / 2,
              top: position.y - BEAD_SIZE / 2,
              opacity: isActive ? 1 : isCompleted ? 0.85 : 0.5,
              transform: [{ scale: isActive ? 1.3 : 1 }],
            },
            isActive && styles.activeBeadContainer,
          ]}
        >
          <Image
            source={require('@/assets/images/rudrasha.png')}
            style={styles.rudrashaImage}
            resizeMode="contain"
          />
        </Animated.View>
      );
    }
    return beads;
  };

  // Rotation interpolation
  const rotationInterpolate = rotationAnim.interpolate({
    inputRange: [0, 720],
    outputRange: ['0deg', '720deg'],
    extrapolate: 'extend',
  });

  return (
    <View style={styles.outerContainer}>
      {/* Semi-transparent backdrop for bead visibility */}
      <View style={styles.backdrop} />

      <View style={styles.container}>
        {/* Mala Circle */}
        <Animated.View
          style={[
            styles.malaCircle,
            {
              width: MALA_SIZE,
              height: MALA_SIZE,
              transform: [{ rotate: rotationInterpolate }],
            },
          ]}
        >
          {renderBeads()}
        </Animated.View>

        {/* Center Om Symbol — Tap Target */}
        <TouchableOpacity
          onPress={handleTap}
          activeOpacity={0.8}
          style={styles.centerSymbol}
        >
          <Animated.View
            style={[
              styles.symbolContainer,
              { transform: [{ scale: scaleAnim }] },
            ]}
          >
            <Text style={styles.omSymbol}>ॐ</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: BACKDROP_SIZE,
    height: BACKDROP_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    position: 'absolute',
    width: BACKDROP_SIZE,
    height: BACKDROP_SIZE,
    borderRadius: BACKDROP_SIZE / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(180, 83, 9, 0.08)',
  },
  container: {
    width: MALA_SIZE,
    height: MALA_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  malaCircle: {
    position: 'absolute',
    width: MALA_SIZE,
    height: MALA_SIZE,
    borderRadius: MALA_SIZE / 2,
  },
  bead: {
    position: 'absolute',
    width: BEAD_SIZE,
    height: BEAD_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rudrashaImage: {
    width: BEAD_SIZE,
    height: BEAD_SIZE,
  },
  activeBeadContainer: {
    shadowColor: '#5D4037',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
  centerSymbol: {
    width: MALA_SIZE * 0.48,
    height: MALA_SIZE * 0.48,
    borderRadius: (MALA_SIZE * 0.48) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  symbolContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  omSymbol: {
    fontSize: MALA_SIZE * 0.2,
    color: '#3E2723',
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 255, 255, 0.4)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
});
