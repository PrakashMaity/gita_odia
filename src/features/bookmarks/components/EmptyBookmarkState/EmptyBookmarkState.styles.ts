import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.xl,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 500,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: SIZES.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    height: 180/2,
    width: 180/2,
  },
  iconCircle: {
    width: 140/2,
    height: 140/2,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  iconCircleSmall: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  iconCircleTop: {
    top: 0,
    right: 0,
  },
  iconCircleBottom: {
    bottom: 0,
    left: 0,
  },
  title: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
    fontWeight: '700',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.xl,
    paddingHorizontal: SIZES.spacing.lg,
    lineHeight: SIZES.spacing.xl * 1.5,
  },
  tipsCard: {
    width: '100%',
    marginBottom: SIZES.spacing.xl,
    padding: SIZES.spacing.xl,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  tipsIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xxxl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.md,
  },
  tipsTitle: {
    flex: 1,
    fontWeight: '600',
  },
  tipsList: {
    gap: SIZES.spacing.md,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  tipIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  tipText: {
    flex: 1,
    lineHeight: SIZES.spacing.xl * 1.3,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xl,
    minWidth: 200,
    borderWidth: SIZES.borderSize.sm,
  },
  browseButtonText: {
    fontWeight: '600',
  },
  quoteCard: {
    width: '100%',
    padding: SIZES.spacing.xl,
    marginTop: SIZES.spacing.md,
  },
  quoteContainer: {
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: SIZES.spacing.sm,
    opacity: 0.6,
  },
  quoteText: {
    textAlign: 'center',
    paddingHorizontal: SIZES.spacing.md,
  },
});

