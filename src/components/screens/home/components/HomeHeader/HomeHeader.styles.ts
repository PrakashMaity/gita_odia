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
    paddingHorizontal: SIZES.spacing.xs,
    paddingVertical: 2,
    borderRadius: SIZES.borderRadius.sm,
    gap: 4,
  },
  proText: {
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
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

