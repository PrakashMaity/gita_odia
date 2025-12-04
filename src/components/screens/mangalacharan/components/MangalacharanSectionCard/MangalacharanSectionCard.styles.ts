import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  introCard: {
    marginBottom: SIZES.spacing.lg,
    padding: SIZES.spacing.xl,
  },
  card: {
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
  text: {
    lineHeight: SIZES.spacing.xl,
  },
  centeredText: {
    textAlign: 'center',
  },
  list: {
    gap: SIZES.spacing.md,
  },
  listItem: {
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
  itemText: {
    flex: 1,
  },
  breakdownContainer: {
    gap: SIZES.spacing.lg,
  },
  breakdownSection: {
    gap: SIZES.spacing.md,
  },
  breakdownSectionSpacing: {
    marginTop: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.xl,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  breakdownSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.sm,
  },
  breakdownTitle: {
    fontWeight: '600',
    flex: 1,
  },
  breakdownMantra: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl * 1.5,
    marginVertical: SIZES.spacing.md,
    fontStyle: 'italic',
  },
  breakdownMeaning: {
    lineHeight: SIZES.spacing.xl * 1.3,
  },
  introContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  introContent: {
    flex: 1,
  },
  speakerButton: {
    width: SIZES.icon.lg + SIZES.spacing.sm,
    height: SIZES.icon.lg + SIZES.spacing.sm,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SIZES.borderSize.xs,
    marginLeft: SIZES.spacing.md,
  },
  speakerButtonIntro: {
    marginLeft: 0,
    marginTop: SIZES.spacing.xs,
  },
  speakerButtonSmall: {
    width: SIZES.icon.md + SIZES.spacing.xs,
    height: SIZES.icon.md + SIZES.spacing.xs,
    marginLeft: SIZES.spacing.sm,
  },
  speakerButtonActive: {
    opacity: 0.8,
  },
});

