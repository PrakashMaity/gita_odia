import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  heroCard: {
    margin: 16,
    marginBottom: 8,
  },
  heroCardTablet: {
    marginHorizontal: 0,
  },
  heroContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
  },
  textOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlayText: {
    textAlign: 'center',
  
  },
});

