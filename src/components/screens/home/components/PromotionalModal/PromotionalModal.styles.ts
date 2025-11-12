import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  modalContainer: {
    width: '100%',
    borderRadius: SIZES.radius.xxl,
    padding: SIZES.spacing.xl,
    maxHeight: '85%',
    borderWidth: SIZES.borderSize.sm,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
    paddingBottom: SIZES.spacing.lg,
    borderBottomWidth: SIZES.borderSize.xs,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerIconContainer: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.md,
  },
  modalTitle: {
    flex: 1,
    fontWeight: 'bold',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.md,
  },
  itemsList: {
    gap: SIZES.spacing.md,
  },
  itemContainer: {
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    borderLeftWidth: 4,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.md,
    },
    shadowOpacity: 0.1,
    shadowRadius: SIZES.shadow.lg,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.md,
    shadowOffset: {
      width: 0,
      height: SIZES.shadow.sm,
    },
    shadowOpacity: 0.15,
    shadowRadius: SIZES.shadow.md,
    elevation: 2,
  },
  contentContainer: {
    flex: 1,
  },
  titleRow: {
    marginBottom: SIZES.spacing.xs,
  },
  itemTitle: {
    marginBottom: SIZES.spacing.sm,
  },
  itemDescription: {
    lineHeight: 22,
    marginBottom: SIZES.spacing.sm,
  },
  badgeContainer: {
    marginTop: SIZES.spacing.xs,
  },
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.radius.md,
  },
  badgeText: {
    fontWeight: '600',
  },
});

