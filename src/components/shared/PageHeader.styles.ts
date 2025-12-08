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
    paddingVertical: SIZES.spacing.md,
    paddingHorizontal: SIZES.spacing.md,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: SIZES.icon.lg,
    height: SIZES.icon.lg,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.spacing.sm,
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

