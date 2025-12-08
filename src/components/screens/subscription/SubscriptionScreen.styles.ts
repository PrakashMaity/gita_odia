import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl * 2,
  },
  comingSoonContainer: {
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
    marginTop: SIZES.spacing.md,
  },
  comingSoonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.sm,
    borderRadius: SIZES.radius.full,
    gap: SIZES.spacing.xs,
  },
  comingSoonIcon: {
    marginRight: SIZES.spacing.xs,
  },
  comingSoonText: {
    fontWeight: '600',
  },
  featuresCard: {
    padding: SIZES.spacing.xl,
    marginBottom: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
  },
  premiumIconContainer: {
    marginBottom: SIZES.spacing.lg,
  },
  premiumTitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    fontWeight: '700',
  },
  premiumDescription: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.xl,
    opacity: 0.8,
  },
  featuresList: {
    width: '100%',
    gap: SIZES.spacing.md,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  featureText: {
    flex: 1,
  },
  plansContainer: {
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.xl,
  },
  planCard: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.lg,
    marginBottom: SIZES.spacing.md,
  },
  planCardFeatured: {
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.md,
  },
  planTitle: {
    fontWeight: '700',
    flex: 1,
  },
  planBadge: {
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs / 2,
    borderRadius: SIZES.radius.sm,
  },
  planBadgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  planPrice: {
    fontWeight: '700',
    marginBottom: SIZES.spacing.xs,
  },
  planSavings: {
    opacity: 0.7,
  },
});
