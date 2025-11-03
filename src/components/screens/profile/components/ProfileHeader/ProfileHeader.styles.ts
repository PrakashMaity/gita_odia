import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  headerCard: {
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  headerContent: {
    alignItems: 'flex-start',
  },
  title: {
    marginBottom: SIZES.spacing.xs,
  },
  subtitle: {
    opacity: 0.8,
  },
});

