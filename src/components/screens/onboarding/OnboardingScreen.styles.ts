import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';
import { Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.md,
  },
  skipButton: {
    paddingHorizontal: SIZES.spacing.md,
    paddingVertical: SIZES.spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.spacing.xl,
  },
  imageCard: {
    margin: SIZES.spacing.lg,
    marginBottom: SIZES.spacing.md,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: SIZES.radius.xl,
    overflow: 'hidden',
    height: height * 0.4,
  },
  onboardingImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  contentCard: {
    margin: SIZES.spacing.lg,
    marginTop: SIZES.spacing.sm,
  },
  contentContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.spacing.lg,
  },
  title: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.lg,
    opacity: 0.9,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.8,
  },
  bottomContainer: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xl,
  },
  pageIndicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.spacing.xl,
    gap: SIZES.spacing.sm,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: SIZES.spacing.md,
  },
  navButton: {
    flex: 1,
  },
  primaryButton: {
    flex: 2,
  },
});

