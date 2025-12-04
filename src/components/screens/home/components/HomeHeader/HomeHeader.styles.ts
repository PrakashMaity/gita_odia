import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: SIZES.spacing.sm,
    gap: SIZES.spacing.xs,
  },
  title: {
    // Title text styling
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
    marginLeft: SIZES.spacing.xs,
    elevation: 2,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  proText: {
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.8,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.spacing.xs,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

