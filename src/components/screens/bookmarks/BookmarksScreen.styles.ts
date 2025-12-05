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
  },
  statsSection: {
    marginTop: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
  },
  statsCard: {
    padding: SIZES.spacing.sm,
    marginBottom: 0,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs / 2,
  },
  statsIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.xs,
  },
  statsTitle: {
    flex: 1,
    fontWeight: '600',
  },
  statsText: {
    lineHeight: SIZES.spacing.lg * 1.2,
    opacity: 0.9,
  },
  section: {
    marginBottom: SIZES.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs / 2,
    paddingHorizontal: 0,
  },
  sectionIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.xs,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  bookmarksContainer: {
    paddingHorizontal: 0,
    gap: SIZES.spacing.xs,
  },
  footerCard: {
    marginTop: SIZES.spacing.xs,
    marginBottom: SIZES.spacing.xs,
    padding: SIZES.spacing.sm,
  },
  footerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs / 2,
  },
  footerIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.xs,
  },
  footerTitle: {
    flex: 1,
    fontWeight: '600',
  },
  footerText: {
    lineHeight: SIZES.spacing.lg * 1.2,
    opacity: 0.9,
  },
});
