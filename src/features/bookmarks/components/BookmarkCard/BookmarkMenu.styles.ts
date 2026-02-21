import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    borderRadius: SIZES.radius.lg,
    padding: SIZES.spacing.xs,
    minWidth: 180,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.spacing.md,
    borderRadius: SIZES.radius.md,
  },
  menuIcon: {
    marginRight: SIZES.spacing.md,
  },
  menuText: {
    flex: 1,
  },
});
