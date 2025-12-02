import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';
import { typography as TYPOGRAPHY } from '@/rootconstants/typography';

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
  sectionStack: {
    width: '100%',
    gap: SIZES.spacing.lg,
  },
  bottomSpacing: {
    height: SIZES.spacing.huge,
  },
});

