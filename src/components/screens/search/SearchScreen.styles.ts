import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
  },
  tipsContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.lg,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: SIZES.spacing.md,
  },
  tipsList: {
    gap: SIZES.spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipText: {
    fontSize: 14,
    marginLeft: SIZES.spacing.sm,
  },
});

