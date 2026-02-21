import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.spacing.xl,
    marginVertical: SIZES.spacing.xs,
  },
  loadingText: {
    marginLeft: SIZES.spacing.md,
  },
  cancelButton: {
    marginTop: SIZES.spacing.lg,
    marginHorizontal: SIZES.spacing.lg,
  },
});

