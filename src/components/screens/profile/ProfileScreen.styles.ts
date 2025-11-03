import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';
import { typography as TYPOGRAPHY } from '@/rootconstants/typography';

export const styles = StyleSheet.create({
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
  bottomSpacing: {
    height: SIZES.spacing.huge,
  },
});

