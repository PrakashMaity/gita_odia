import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
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
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
  },
  introText: {
    lineHeight: 24,
  },
  significanceCard: {
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
  },
  sectionTitle: {
    marginBottom: SIZES.spacing.md,
    fontWeight: '600',
  },
  sectionText: {
    lineHeight: 22,
  },
  listCard: {
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
  },
  listTitle: {
    marginBottom: SIZES.spacing.md,
    fontWeight: '600',
  },
  ekadashiList: {
    gap: SIZES.spacing.md,
  },
  ekadashiItem: {
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    marginBottom: SIZES.spacing.sm,
  },
  ekadashiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.md,
  },
  numberText: {
    fontWeight: '600',
  },
  ekadashiName: {
    flex: 1,
    fontWeight: '600',
  },
  ekadashiDescription: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 20,
  },
  benefitsContainer: {
    marginTop: SIZES.spacing.xs,
    paddingLeft: SIZES.spacing.sm,
  },
  benefitsTitle: {
    fontWeight: '600',
    marginBottom: SIZES.spacing.xs / 2,
  },
  benefitItem: {
    marginBottom: SIZES.spacing.xs / 2,
    lineHeight: 18,
  },
  instructionsCard: {
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
  },
  instructionItem: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 22,
    paddingLeft: SIZES.spacing.xs,
  },
  upcomingCard: {
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
    borderWidth: 2,
  },
  upcomingTitle: {
    marginBottom: SIZES.spacing.sm,
    fontWeight: '600',
  },
  upcomingName: {
    marginBottom: SIZES.spacing.md,
    fontWeight: '700',
  },
  upcomingDescription: {
    marginTop: SIZES.spacing.sm,
    lineHeight: 20,
  },
  datesContainer: {
    marginBottom: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs / 2,
  },
  dateLabel: {
    marginRight: SIZES.spacing.sm,
    minWidth: 100,
  },
  dateValue: {
    flex: 1,
    fontWeight: '500',
  },
  upcomingBadge: {
    fontWeight: '600',
  },
  yearSelectorCard: {
    padding: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
    borderRadius: SIZES.radius.xl,
  },
  yearLabel: {
    marginBottom: SIZES.spacing.md,
    fontWeight: '600',
  },
  yearInputContainer: {
    gap: SIZES.spacing.md,
  },
  yearInput: {
    borderWidth: 1,
    borderRadius: SIZES.radius.md,
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
    fontSize: SIZES.md,
    textAlign: 'center',
  },
  yearButtonsContainer: {
    flexDirection: 'row',
    gap: SIZES.spacing.sm,
    flexWrap: 'wrap',
  },
  yearButton: {
    flex: 1,
    minWidth: '22%',
    paddingVertical: SIZES.spacing.sm,
    paddingHorizontal: SIZES.spacing.md,
    borderRadius: SIZES.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  yearButtonText: {
    fontWeight: '600',
  },
});

