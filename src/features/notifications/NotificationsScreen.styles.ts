import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  notificationsList: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingTop: SIZES.spacing.md,
    gap: SIZES.spacing.md,
  },
  notificationItem: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: SIZES.spacing.md,
    marginTop: SIZES.spacing.xs,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs,
  },
  itemTitle: {
    flex: 1,
    marginBottom: SIZES.spacing.xs,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: SIZES.radius.round,
    marginLeft: SIZES.spacing.xs,
  },
  itemMessage: {
    marginBottom: SIZES.spacing.sm,
    lineHeight: 20,
  },
  itemTime: {
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xxl,
    paddingHorizontal: SIZES.spacing.lg,
  },
  loadingText: {
    marginTop: SIZES.spacing.md,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xxl,
    paddingHorizontal: SIZES.spacing.lg,
  },
  errorText: {
    marginTop: SIZES.spacing.md,
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.spacing.xxl,
    paddingHorizontal: SIZES.spacing.lg,
  },
  emptyText: {
    marginTop: SIZES.spacing.md,
    textAlign: 'center',
  },
});

