import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  containerMobile: {
    paddingHorizontal: SIZES.spacing.xs,
  },
  containerTablet: {
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: SIZES.spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.sm,
  },
  sectionIndicator: {
    width: 5,
    height: 28,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  menuContainer: {
    gap: SIZES.spacing.xs,
  },
  menuContainerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItemContainer: {
    width: '100%',
  },
  menuItemGrid: {
    marginBottom: SIZES.spacing.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.xl,
    borderWidth: 1,
    minHeight: 80,
    height: 80,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
    overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: '100%',
    borderRadius: SIZES.radius.xl,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  descriptionText: {
    marginTop: SIZES.spacing.xs / 2,
    lineHeight: 16,
  },
  arrowContainer: {
    width: 24,
    height: 24,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SIZES.spacing.sm,
  },
});

