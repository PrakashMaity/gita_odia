import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: SIZES.spacing.lg,
  },
  chatContent: {
    paddingBottom: SIZES.spacing.xl,
  },
});

