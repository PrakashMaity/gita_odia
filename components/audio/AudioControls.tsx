import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { StyleSheet, View } from 'react-native';
import { NeumorphicButton } from './NeumorphicButton';

interface AudioControlsProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onLike: () => void;
  isShuffled?: boolean;
  isRepeated?: boolean;
  isLiked?: boolean;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
  isPlaying,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  onLike,
  isShuffled = false,
  isRepeated = false,
  isLiked = false,
}) => {
  const theme = useThemeColors();

  const PlayIcon = () => (
    <View style={[styles.playIcon, { borderLeftColor: theme.text.primary }]} />
  );

  const PauseIcon = () => (
    <View style={styles.pauseIcon}>
      <View style={[styles.pauseBar, { backgroundColor: theme.text.primary }]} />
      <View style={[styles.pauseBar, { backgroundColor: theme.text.primary }]} />
    </View>
  );

  const PreviousIcon = () => (
    <View style={styles.previousIcon}>
      <View style={[styles.previousBar, { backgroundColor: theme.icon.primary }]} />
      <View style={[styles.previousTriangle, { borderLeftColor: theme.icon.primary }]} />
    </View>
  );

  const NextIcon = () => (
    <View style={styles.nextIcon}>
      <View style={[styles.nextTriangle, { borderLeftColor: theme.icon.primary }]} />
      <View style={[styles.nextBar, { backgroundColor: theme.icon.primary }]} />
    </View>
  );



  return (
    <View style={styles.container}>
      {/* Main controls */}
      <View style={styles.mainControls}>
        <NeumorphicButton onPress={onPrevious} size={50} variant="primary">
          <PreviousIcon />
        </NeumorphicButton>
        
        <NeumorphicButton onPress={onPlayPause} size={70} variant="play">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </NeumorphicButton>
        
        <NeumorphicButton onPress={onNext} size={50} variant="primary">
          <NextIcon />
        </NeumorphicButton>
      </View>

     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SIZES.spacing.xl,
  },
  mainControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.xl,
  },
  bottomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.xxl,
  },
  // Play icon styles
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 20,
    borderTopWidth: 12,
    borderBottomWidth: 12,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 4,
  },
  // Pause icon styles
  pauseIcon: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBar: {
    width: 4,
    height: 20,
    borderRadius: 2,
  },
  // Previous icon styles
  previousIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previousBar: {
    width: 8,
    height: 2,
    marginRight: 2,
  },
  previousTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  // Next icon styles
  nextIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderTopWidth: 6,
    borderBottomWidth: 6,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  nextBar: {
    width: 8,
    height: 2,
    marginLeft: 2,
  },
  // Shuffle icon styles
  shuffleIcon: {
    position: 'relative',
    width: 16,
    height: 16,
  },
  shuffleArrow1: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  shuffleArrow2: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 0,
    height: 0,
    borderRightWidth: 4,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  // Repeat icon styles
  repeatIcon: {
    position: 'relative',
    width: 16,
    height: 16,
  },
  repeatArrow1: {
    position: 'absolute',
    top: 2,
    left: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  repeatArrow2: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 0,
    height: 0,
    borderLeftWidth: 4,
    borderTopWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  // Heart icon styles
  heartIcon: {
    width: 16,
    height: 14,
    borderWidth: 1,
    borderRadius: 8,
    position: 'relative',
  },
  heartTop: {
    position: 'absolute',
    top: -6,
    left: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    transform: [{ rotate: '45deg' }],
  },
});
