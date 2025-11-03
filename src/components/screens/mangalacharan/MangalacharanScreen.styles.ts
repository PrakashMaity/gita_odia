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
  introText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
  prayerCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  meaningCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  instructionsCard: {
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
  prayerText: {
    textAlign: 'center',
  },
  meaningText: {
    lineHeight: SIZES.spacing.xl,
  },
  instructionList: {
    gap: SIZES.spacing.md,
  },
  instructionItem: {
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
  instructionText: {
    flex: 1,
    lineHeight: SIZES.spacing.lg,
  },
});

