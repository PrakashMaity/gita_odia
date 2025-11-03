import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SIZES.spacing.sm,
  },
  actionButton: {
    borderWidth: SIZES.borderSize.sm,
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.lg,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  sectionIndicator: {
    width: 5,
    height: 32,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  sectionTitle: {
    flex: 1,
    fontWeight: '600',
  },
  bookmarksContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    gap: SIZES.spacing.sm,
  },
  bookmarkCardContainer: {
    marginBottom: SIZES.spacing.md,
  },
  bookmarkCard: {
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
  footer: {
    alignItems: 'center',
    marginTop: SIZES.spacing.xl,
    paddingTop: SIZES.spacing.lg,
  },
  footerText: {
    textAlign: 'center',
  },
});

