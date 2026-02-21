import { SIZES } from '@/rootconstants/sizes';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    position: 'relative',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SIZES.spacing.lg,
    paddingBottom: SIZES.spacing.xxxl,
    alignItems: 'center',
  },
  settingsButton: {
    width: SIZES.header.sm,
    height: SIZES.header.sm,
    borderRadius: SIZES.radius.round,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  malaContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.spacing.xl,
    minHeight: 420,
  },
  instructionContainer: {
    marginTop: SIZES.spacing.xl,
    paddingHorizontal: SIZES.spacing.lg,
    paddingVertical: SIZES.spacing.sm,
    backgroundColor: 'rgba(255, 243, 224, 0.8)',
    borderRadius: SIZES.radius.lg,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  instructionText: {
    textAlign: 'center',
    fontSize: 13,
    color: '#5D4037',
  },
});
