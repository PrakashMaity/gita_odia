import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  card: {
    marginVertical: SIZES.spacing.md,
    marginHorizontal: SIZES.spacing.lg,
    padding: SIZES.spacing.xl + 4,
    position: 'relative',
    borderRadius: SIZES.radius.xl + 4,
    minHeight: 320,
    overflow: 'visible',
  },
  featuredCard: {
    borderWidth: 3,
    transform: [{ scale: 1.03 }],
    elevation: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    marginVertical: SIZES.spacing.lg,
  },
  bestValueBadge: {
    position: 'absolute',
    top: -SIZES.spacing.md,
    right: SIZES.spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.md + 2,
    paddingVertical: SIZES.spacing.xs + 2,
    borderRadius: SIZES.radius.full,
    gap: SIZES.spacing.xs,
    elevation: 6,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    zIndex: 10,
  },
  bestValueText: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  cardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    marginBottom: SIZES.spacing.md,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  priceSection: {
    width: '100%',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md + 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: SIZES.spacing.xs,
    flexWrap: 'wrap',
  },
  price: {
    fontWeight: '800',
    fontSize: 42,
    lineHeight: 48,
    letterSpacing: -0.5,
  },
  featuredPrice: {
    fontSize: 46,
    lineHeight: 52,
  },
  period: {
    opacity: 0.75,
    marginLeft: SIZES.spacing.xs,
    fontSize: 15,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: SIZES.spacing.xl,
    paddingVertical: SIZES.spacing.sm,
    flex: 1,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.xs,
    minHeight: 24,
  },
  checkIcon: {
    marginRight: SIZES.spacing.md,
    marginTop: 2,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
  subscribeButton: {
    marginTop: SIZES.spacing.lg,
    minHeight: 52,
    borderRadius: SIZES.radius.lg,
  },
});

