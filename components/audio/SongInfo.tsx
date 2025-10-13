import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { StyleSheet, View } from 'react-native';

interface SongInfoProps {
  title: string;
  artist: string;
  playlist?: string;
}

export const SongInfo: React.FC<SongInfoProps> = ({
  title,
  artist,
  playlist,
}) => {
  const theme = useThemeColors();

  return (
    <View style={styles.container}>
      {playlist && (
        <ThemedText 
          variant="secondary" 
          size="sm" 
          style={[styles.playlist, { color: theme.text.secondary }]}
        >
          {playlist}
        </ThemedText>
      )}
      <ThemedText 
        variant="primary" 
        size="xl" 
        weight="bold"
        style={[styles.title, { color: theme.text.primary }]}
      >
        {title}
      </ThemedText>
      <ThemedText 
        variant="secondary" 
        size="md"
        style={[styles.artist, { color: theme.text.secondary }]}
      >
        {artist}
      </ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.xl,
  },
  playlist: {
    opacity: 0.8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    textAlign: 'center',
    lineHeight: 28,
  },
  artist: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
