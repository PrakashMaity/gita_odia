import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.md,
  },
  title: {
    flexShrink: 1,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SIZES.borderSize.sm,
  },
});

