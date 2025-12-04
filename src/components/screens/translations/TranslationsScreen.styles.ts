import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SIZES.spacing.xl,
  },
  translationsContainer: {
    paddingHorizontal: SIZES.spacing.xs,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  translationCardWrapper: {
    width: '49.5%',
    marginBottom: SIZES.spacing.xs,
  },
});

