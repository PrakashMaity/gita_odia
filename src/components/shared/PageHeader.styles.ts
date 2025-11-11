import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerContainer: {
    marginHorizontal: 0,
    marginTop: 0,
    borderRadius: 0,
    overflow: 'visible',
  },
  headerContent: {
    paddingVertical: SIZES.spacing.lg,
    paddingHorizontal: SIZES.spacing.lg,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: SIZES.header.sm,
    height: SIZES.header.sm,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.md,
    borderWidth: SIZES.borderSize.md,
  },
  title: {
    marginBottom: SIZES.spacing.xs / 2,
  },
  subtitle: {
    marginTop: SIZES.spacing.xs / 2,
    opacity: 0.85,
  },
  textContainer: {
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

