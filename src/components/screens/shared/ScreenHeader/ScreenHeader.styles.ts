import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: 'stretch',
  },
  headerBackground: {
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.85,
  },
  headerImage: {},
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.spacing.xs,
    paddingHorizontal: SIZES.spacing.sm,
    width: '100%',
  },
  leftSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrapper: {
    flexShrink: 1,
  },
  title: {
    marginBottom: SIZES.spacing.xs / 2,
  },
  subtitle: {
    opacity: 0.85,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginLeft: SIZES.spacing.sm,
  },
});


