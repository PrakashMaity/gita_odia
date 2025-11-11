import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    // marginHorizontal: SIZES.spacing.xs,
    // marginVertical: SIZES.spacing.xs,
    // borderRadius: SIZES.radius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 6,
    alignSelf: 'stretch',
  },
  headerBackground: {
    // borderRadius: SIZES.radius.lg,
    // overflow: 'hidden',
    width: '100%',
  },
  headerImage: {
    // borderRadius: SIZES.radius.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES.spacing.xs,
    paddingHorizontal: SIZES.spacing.sm,
    width: '100%',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    marginLeft: SIZES.spacing.sm,
  },
  iconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: SIZES.radius.round,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SIZES.spacing.xs,
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
});

