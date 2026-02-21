import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs,
    gap: SIZES.spacing.xs,
  },
  title: {
    textTransform: 'none',
    letterSpacing: 0.3,
    fontWeight: '700',
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.sm,
    paddingVertical: SIZES.spacing.xs,
    borderRadius: SIZES.borderRadius.sm,
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
  subtitle: {
    textTransform: 'none',
    letterSpacing: 0.2,
    lineHeight: 18,
    fontWeight: '400',
  },
});

