import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.lg,
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    width: '100%',
  },
  iconContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.2,
    shadowRadius: SIZES.shadow.md,
    elevation: 3,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  subtitle: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 20,
    opacity: 0.85,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  verseCount: {
    opacity: 0.9,
  },
  arrowContainer: {
    width: SIZES.avatar.sm,
    height: SIZES.avatar.sm,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.sm,
  },
  progressSpacer: {
    marginTop: SIZES.spacing.md,
  },
  progressText: {
    opacity: 0.9,
    fontWeight: '600',
    textAlign: 'center',
  },
});

