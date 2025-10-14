import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import React from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    PanResponder,
    StyleSheet,
    TouchableOpacity,
    View
} from 'react-native';
import { AlbumArt } from './AlbumArt';
import { AudioControls } from './AudioControls';
import { CircularProgress } from './CircularProgress';
import { SongInfo } from './SongInfo';

const { height } = Dimensions.get('window');

interface AudioPlayerModalProps {
  visible: boolean;
  onClose: () => void;
  song: {
    id: string;
    title: string;
    artist: string;
    imageUrl?: string;
  };
  isPlaying: boolean;
  progress: number;
  isShuffled: boolean;
  isRepeated: boolean;
  isLiked: boolean;
  onPlayPause: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onShuffle: () => void;
  onRepeat: () => void;
  onLike: () => void;
}

export const AudioPlayerModal: React.FC<AudioPlayerModalProps> = ({
  visible,
  onClose,
  song,
  isPlaying,
  progress,
  isShuffled,
  isRepeated,
  isLiked,
  onPlayPause,
  onPrevious,
  onNext,
  onShuffle,
  onRepeat,
  onLike,
}) => {
  const theme = useThemeColors();
  const translateY = React.useRef(new Animated.Value(height)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      Animated.timing(translateY, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, translateY]);

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dy > 0 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }).start();
      }
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity 
          style={styles.backdrop} 
          activeOpacity={1} 
          onPress={onClose}
        />
        
        <Animated.View 
          style={[
            styles.modalContainer,
            {
              backgroundColor: theme.background.primary,
              transform: [{ translateY }],
            }
          ]}
          {...panResponder.panHandlers}
        >
          {/* Handle bar */}
          <View style={[styles.handleBar, { backgroundColor: theme.border.tertiary }]} />
          
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <ThemedText variant="primary" size="lg">✕</ThemedText>
            </TouchableOpacity>
            <ThemedText variant="primary" size="md" weight="bold">
              Now Playing
            </ThemedText>
            <View style={styles.placeholder} />
          </View>

          {/* Player Content */}
          <View style={styles.playerContent}>
            {/* Circular Progress with Album Art */}
            <CircularProgress progress={progress} size={height * 0.35}>
              <AlbumArt imageUrl={song.imageUrl} size={height * 0.25} />
            </CircularProgress>

            {/* Song Info */}
            <SongInfo
              title={song.title}
              artist={song.artist}
              playlist={i18n.t('audio.playlist')}
            />

            {/* Audio Controls */}
            <AudioControls
              isPlaying={isPlaying}
              onPlayPause={onPlayPause}
              onPrevious={onPrevious}
              onNext={onNext}
              onShuffle={onShuffle}
              onRepeat={onRepeat}
              onLike={onLike}
              isShuffled={isShuffled}
              isRepeated={isRepeated}
              isLiked={isLiked}
            />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    flex: 1,
  },
  modalContainer: {
    height: height * 0.85,
    borderTopLeftRadius: SIZES.radius.xxl,
    borderTopRightRadius: SIZES.radius.xxl,
    paddingTop: SIZES.spacing.md,
    paddingBottom: SIZES.spacing.xxxl,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    marginBottom: SIZES.spacing.xl,
  },
  closeButton: {
    padding: SIZES.spacing.sm,
  },
  placeholder: {
    width: 30,
  },
  playerContent: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
    gap: SIZES.spacing.xxl,
  },
});
