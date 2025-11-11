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
  title: {
    marginLeft: SIZES.spacing.sm,
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

