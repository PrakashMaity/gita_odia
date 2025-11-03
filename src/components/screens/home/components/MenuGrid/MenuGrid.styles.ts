import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.lg,
  },
  section: {
    marginBottom: SIZES.spacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.sm,
  },
  sectionIndicator: {
    width: 5,
    height: 28,
    borderRadius: SIZES.radius.md,
    marginRight: SIZES.spacing.md,
  },
  menuContainer: {
    gap: SIZES.spacing.sm,
  },
  menuItemContainer: {
    marginBottom: SIZES.spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.sm,
    borderRadius: SIZES.radius.xl,
    borderWidth: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: SIZES.radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.lg,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
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

