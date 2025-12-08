import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  leftContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.spacing.md,
  },
  title: {
    flexShrink: 1,
  },
  actionButton: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: SIZES.borderSize.sm,
  },
});

