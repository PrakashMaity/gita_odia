import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
  },
  verseContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.xl,
  },
});

