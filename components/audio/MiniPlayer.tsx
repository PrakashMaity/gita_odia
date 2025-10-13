import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlbumArt } from './AlbumArt';
import { NeumorphicButton } from './NeumorphicButton';

interface MiniPlayerProps {
  title: string;
  artist: string;
  imageUrl?: string;
  progress: number; // 0 to 1
  isPlaying: boolean;
  onPress: () => void;
  onPlayPause: () => void;
  onNext: () => void;
}

export const MiniPlayer: React.FC<MiniPlayerProps> = ({
  title,
  artist,
  imageUrl,
  progress,
  isPlaying,
  onPress,
  onPlayPause,
  onNext,
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

  const NextIcon = () => (
    <View style={styles.nextIcon}>
      <View style={[styles.nextTriangle, { borderLeftColor: theme.icon.primary }]} />
      <View style={[styles.nextBar, { backgroundColor: theme.icon.primary }]} />
    </View>
  );

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.background.card,
          borderColor: theme.border.tertiary,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <AlbumArt imageUrl={imageUrl} size={40} />
      
      <View style={styles.textContainer}>
        <ThemedText 
          variant="primary" 
          size="sm"
          weight="bold"
          style={[styles.title, { color: theme.text.primary }]}
          numberOfLines={1}
        >
          {title}
        </ThemedText>
        <ThemedText 
          variant="secondary" 
          size="xs"
          style={[styles.artist, { color: theme.text.secondary }]}
          numberOfLines={1}
        >
          {artist}
        </ThemedText>
        
        {/* Progress bar */}
        <View style={[styles.progressContainer, { backgroundColor: theme.background.secondary }]}>
          <View 
            style={[
              styles.progressBar, 
              { 
                backgroundColor: theme.icon.secondary,
                width: `${progress * 100}%` 
              }
            ]} 
          />
        </View>
      </View>

      <View style={styles.controls}>
        <NeumorphicButton onPress={onPlayPause} size={35} variant="primary">
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </NeumorphicButton>
        
        <NeumorphicButton onPress={onNext} size={35} variant="primary">
          <NextIcon />
        </NeumorphicButton>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.md,
    marginHorizontal: SIZES.spacing.md,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  textContainer: {
    flex: 1,
    marginLeft: SIZES.spacing.md,
    marginRight: SIZES.spacing.md,
  },
  title: {
    marginBottom: 2,
  },
  artist: {
    marginBottom: SIZES.spacing.sm,
    opacity: 0.8,
  },
  progressContainer: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  controls: {
    flexDirection: 'row',
    gap: SIZES.spacing.sm,
  },
  // Icon styles (reused from AudioControls)
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderTopWidth: 8,
    borderBottomWidth: 8,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
  pauseIcon: {
    flexDirection: 'row',
    gap: 2,
  },
  pauseBar: {
    width: 3,
    height: 12,
    borderRadius: 1,
  },
  nextIcon: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextTriangle: {
    width: 0,
    height: 0,
    borderLeftWidth: 6,
    borderTopWidth: 4,
    borderBottomWidth: 4,
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
  },
  nextBar: {
    width: 6,
    height: 2,
    marginLeft: 1,
  },
});
