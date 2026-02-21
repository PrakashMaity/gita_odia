import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  text: {
    lineHeight: SIZES.spacing.xl,
  },
  centeredText: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
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
  speakerButtonActive: {
    opacity: 0.8,
  },
});

