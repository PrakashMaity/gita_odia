import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.md,
  },
  card: {
    padding: SIZES.spacing.xl,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
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
  chapterNumber: {
    fontWeight: '600',
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
});

