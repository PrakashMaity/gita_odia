import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  quickActionsCard: {
    flexDirection: 'row',
    gap: SIZES.spacing.md,
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
    marginBottom: SIZES.spacing.sm,
  },
});

