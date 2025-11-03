import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  introCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  introTitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.md,
  },
  introText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
  dhyanaCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  meaningCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  benefitsCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  stepsCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: SIZES.borderSize.xxl,
    height: SIZES.spacing.xxxl,
    borderRadius: SIZES.radius.sm,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
  },
  dhyanaText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
    fontStyle: 'italic',
  },
  meaningText: {
    lineHeight: SIZES.spacing.xl,
  },
  benefitsList: {
    gap: SIZES.spacing.md,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radius.round,
    marginTop: SIZES.spacing.sm,
  },
  benefitText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
  stepsList: {
    gap: SIZES.spacing.md,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.xs,
  },
  stepNumberText: {
    color: '#FFFFFF',
  },
  stepText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});

