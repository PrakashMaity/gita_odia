import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

