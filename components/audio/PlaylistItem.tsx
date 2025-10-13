import { ThemedText } from '@/components/ui/ThemedText/ThemedText';
import { SIZES } from '@/constants/sizes';
import { useThemeColors } from '@/hooks/useTheme';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AlbumArt } from './AlbumArt';

interface PlaylistItemProps {
  title: string;
  artist: string;
  imageUrl?: string;
  isActive?: boolean;
  onPress: () => void;
}

export const PlaylistItem: React.FC<PlaylistItemProps> = ({
  title,
  artist,
  imageUrl,
  isActive = false,
  onPress,
}) => {
  const theme = useThemeColors();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.background.secondary,
          borderColor: isActive ? theme.icon.secondary : theme.border.tertiary,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <AlbumArt imageUrl={imageUrl} size={50} />
      <View style={styles.textContainer}>
        <ThemedText 
          variant="primary" 
          size="md"
          weight="bold"
          style={{...styles.title, color: isActive ? theme.icon.secondary : theme.text.primary }}
       
        >
          {title}
        </ThemedText>
        <ThemedText 
          variant="secondary" 
          size="sm"
          style={{...styles.artist, color: theme.text.secondary }}
        >
          {artist}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.md,
    marginVertical: SIZES.spacing.xs,
    marginHorizontal: SIZES.spacing.md,
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
  },
  title: {
    marginBottom: SIZES.spacing.xs,
  },
  artist: {
    opacity: 0.8,
  },
});
