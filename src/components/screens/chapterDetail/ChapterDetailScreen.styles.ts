import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verseContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.xl,
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.lg,
    gap: SIZES.spacing.xs,
  },
  verseNavButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    gap: SIZES.spacing.sm,
    minHeight: 44,
  },
});

