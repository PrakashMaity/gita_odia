import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

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
  emptyStateWrapper: {
    paddingVertical: SIZES.spacing.xl,
  },
  sectionStack: {
    width: '100%',
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  bookmarksContainer: {
    width: '100%',
    gap: SIZES.spacing.sm,
  },
  bookmarksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    columnGap: SIZES.spacing.lg,
    rowGap: SIZES.spacing.lg,
  },
  bookmarkWrapper: {
    width: '100%',
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
  },
  footerText: {
    textAlign: 'center',
  },
});

