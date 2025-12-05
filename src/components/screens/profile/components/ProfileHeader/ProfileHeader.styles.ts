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
  },
  title: {
    textTransform: 'none',
    letterSpacing: 0.3,
    fontWeight: '700',
  },
  proText: {
    fontWeight: 'bold',
    marginLeft: SIZES.spacing.xs,
    textTransform: 'none',
    letterSpacing: 0.3,
  },
  subtitle: {
    textTransform: 'none',
    letterSpacing: 0.2,
    lineHeight: 18,
    fontWeight: '400',
  },
});

