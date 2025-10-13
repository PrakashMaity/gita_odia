import { useThemeColors } from '@/hooks/useTheme';
import { Image, StyleSheet, View } from 'react-native';

interface AlbumArtProps {
  imageUrl?: string;
  size?: number;
}

export const AlbumArt: React.FC<AlbumArtProps> = ({
  imageUrl,
  size = 200,
}) => {
  const theme = useThemeColors();

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <View style={[styles.outerRing, { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        backgroundColor: theme.background.card,
        borderColor: theme.border.tertiary,
      }]}>
        <View style={[styles.innerCircle, { 
          width: size - 20, 
          height: size - 20, 
          borderRadius: (size - 20) / 2,
          backgroundColor: theme.background.secondary,
        }]}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={[styles.image, { 
                width: size - 20, 
                height: size - 20, 
                borderRadius: (size - 20) / 2 
              }]}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.placeholder, { 
              width: size - 20, 
              height: size - 20, 
              borderRadius: (size - 20) / 2,
              backgroundColor: theme.background.tertiary,
            }]}>
              {/* Placeholder content - could be a music note icon */}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: -2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  image: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
