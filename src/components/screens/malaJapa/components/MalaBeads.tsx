import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Animated, TouchableOpacity, Image } from 'react-native';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { SIZES } from '@/rootconstants/sizes';

const { width } = Dimensions.get('window');
const MALA_SIZE = Math.min(width * 0.85, 360);
const BEAD_SIZE = 36; // Increased size for better visibility
const VISUAL_BEAD_COUNT = 12; // Show 12 visual beads instead of all beads
const MALA_RADIUS = MALA_SIZE / 2 - BEAD_SIZE * 1.5;

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

  // Animate rotation when bead changes - rotate on every click based on actual beadCount
  useEffect(() => {
    // Calculate rotation based on actual bead count, so it rotates smoothly on each click
    // Calculate degrees per bead: 360 / beadCount
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

  // Render beads - using rudrasha image, showing only VISUAL_BEAD_COUNT beads
  const renderBeads = () => {
    const beads = [];
    // Calculate which visual bead should be active based on currentBead position
    // Ensure it maps correctly when currentBead reaches the end
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
              opacity: isActive ? 1 : isCompleted ? 0.7 : 0.5,
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

  // Create rotation string - allow values beyond 360 for continuous rotation
  // Rotation naturally wraps (720deg = 360deg = 0deg), so we can use extend
  const rotationInterpolate = rotationAnim.interpolate({
    inputRange: [0, 720],
    outputRange: ['0deg', '720deg'],
    extrapolate: 'extend',
  });

  return (
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

      {/* Center Om Symbol */}
      <TouchableOpacity
        onPress={handleTap}
        activeOpacity={0.8}
        style={styles.centerSymbol}
      >
        <Animated.View
          style={[
            styles.symbolContainer,
            {
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <ThemedLanguageText
            variant="primary"
            size="huge"
            style={styles.omSymbol}
          >
            ॐ
          </ThemedLanguageText>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
    shadowColor: '#FF8F00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  centerSymbol: {
    width: MALA_SIZE * 0.5,
    height: MALA_SIZE * 0.5,
    borderRadius: (MALA_SIZE * 0.5) / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbolContainer: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  omSymbol: {
    fontSize: MALA_SIZE * 0.25,
    color: '#8B4513',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
});
