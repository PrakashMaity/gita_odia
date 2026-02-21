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
  introContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SIZES.spacing.md,
  },
  introContent: {
    flex: 1,
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
  speakerButtonActive: {
    opacity: 0.8,
  },
});

