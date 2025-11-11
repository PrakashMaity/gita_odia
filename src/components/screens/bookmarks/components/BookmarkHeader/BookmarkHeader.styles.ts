import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.spacing.xs,
  },
});

