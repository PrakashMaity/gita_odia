import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  translationsContainer: {
    paddingHorizontal: SIZES.spacing.xs,
  },
});

