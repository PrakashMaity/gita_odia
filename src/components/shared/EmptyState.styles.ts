import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.xl,
  },
  title: {
    marginTop: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: SIZES.spacing.xl,
  },
});

