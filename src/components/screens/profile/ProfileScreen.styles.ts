import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';
import { typography as TYPOGRAPHY } from '@/rootconstants/typography';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  title: {},
  subtitle: {
    fontSize: TYPOGRAPHY.fontSize.md,
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

