import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.md,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
    marginBottom: SIZES.spacing.sm,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.lg,
    elevation: 4,
    position: 'relative',
  },
  deleteButton: {
    position: 'absolute',
    top: SIZES.spacing.sm,
    right: SIZES.spacing.sm,
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.25,
    shadowRadius: SIZES.shadow.md,
    elevation: 4,
  },
  iconContainer: {
    width: SIZES.avatar.md,
    height: SIZES.avatar.md,
    borderRadius: SIZES.radius.md,
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
  bookmarkInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.sm,
  },
  bookmarkDate: {
    opacity: 0.9,
  },
  verseText: {
    lineHeight: 22,
    opacity: 0.85,
  },
});

