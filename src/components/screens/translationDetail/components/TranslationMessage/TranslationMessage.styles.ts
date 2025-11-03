import { StyleSheet } from 'react-native';
import { SIZES } from '@/rootconstants/sizes';

export const styles = StyleSheet.create({
  card: {
    marginBottom: SIZES.spacing.md,
    padding: SIZES.spacing.lg,
    borderRadius: SIZES.radius.xl,
    borderWidth: SIZES.borderSize.sm,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.spacing.md,
  },
  speakerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  speakerAvatar: {
    width: SIZES.avatar.lg,
    height: SIZES.avatar.lg,
    borderRadius: SIZES.radius.round,
    marginRight: SIZES.spacing.md,
  },
  speakerDetails: {
    flex: 1,
  },
  speakerName: {
    marginBottom: SIZES.spacing.xs,
  },
  messageContent: {
    paddingLeft: SIZES.spacing.xl + SIZES.spacing.md,
  },
  translationText: {
    lineHeight: 24,
    textAlign: 'justify',
  },
  bannerContainer: {
    marginBottom: SIZES.spacing.md,
  },
});

