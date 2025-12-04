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
    paddingBottom: SIZES.spacing.xl * 2,
  },
  introCard: {
    marginHorizontal: SIZES.spacing.lg,
    marginTop: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
    alignItems: 'center',
  },
  introContent: {
    alignItems: 'center',
    width: '100%',
  },
  introIcon: {
    marginBottom: SIZES.spacing.md,
  },
  introTitle: {
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
    fontWeight: '600',
  },
  introDescription: {
    textAlign: 'center',
    opacity: 0.8,
    lineHeight: 22,
  },
  plansSection: {
    marginTop: SIZES.spacing.lg,
  },
  plansSectionTitle: {
    marginHorizontal: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  plansContainer: {
    paddingVertical: SIZES.spacing.md,
  },
  premiumCard: {
    margin: SIZES.spacing.xl,
    padding: SIZES.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  premiumTitle: {
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    textAlign: 'center',
  },
  premiumSubtitle: {
    textAlign: 'center',
    opacity: 0.8,
  },
  noPlansCard: {
    margin: SIZES.spacing.xl,
    padding: SIZES.spacing.lg,
    alignItems: 'center',
  },
  restoreButton: {
    marginHorizontal: SIZES.spacing.xl,
    marginTop: SIZES.spacing.xl,
    marginBottom: SIZES.spacing.md,
  },
});

