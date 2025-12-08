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
    paddingHorizontal: SIZES.spacing.sm,
    paddingBottom: SIZES.spacing.sm,
    paddingTop: SIZES.spacing.xs,
  },
  bottomSpacing: {
    height: SIZES.spacing.huge,
  },
});
