import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.spacing.xs,
  },
  card: {
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 0,
    padding: 0,
  },
  indicatorBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIZES.borderSize.xxl,
    borderTopLeftRadius: SIZES.radius.xl,
    borderBottomLeftRadius: SIZES.radius.xl,
  },
  contentContainer: {
    padding: SIZES.spacing.md,
    paddingLeft: SIZES.spacing.lg + SIZES.borderSize.xxl,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SIZES.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chapterBadge: {
    width: 44,
    height: 44,
    borderRadius: SIZES.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.sm,
  },
  chapterNumber: {
    fontWeight: '700',
  },
  chapterInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  chapterTitle: {
    fontWeight: '600',
    marginBottom: 2,
  },
  verseInfo: {
    opacity: 0.8,
  },
  deleteButton: {
    width: 28,
    height: 28,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.xs,
  },
  verseSection: {
    marginBottom: SIZES.spacing.sm,
  },
  verseTextContainer: {
    paddingLeft: SIZES.spacing.xs / 2,
  },
  verseText: {
    lineHeight: SIZES.spacing.lg * 1.3,
    opacity: 0.9,
  },
  footerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SIZES.spacing.xs,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  favoriteIcon: {
    marginRight: SIZES.spacing.xs / 2,
    opacity: 0.7,
  },
  favoriteDate: {
    opacity: 0.7,
    fontSize: 11,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.xs,
  },
});

