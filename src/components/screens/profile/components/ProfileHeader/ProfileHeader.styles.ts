import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xs,
  },
  title: {
    // Title text styling
  },
  proText: {
    fontWeight: 'bold',
    marginLeft: SIZES.spacing.xs,
  },
  subtitle: {
    opacity: 0.8,
  },
});

