import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { SIZES } from '@/rootconstants/sizes';
import { useTheme, useThemeColors } from '@/hooks/useTheme';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Modal, View, TouchableWithoutFeedback, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { ThemedButton } from '@/components/ui/ThemedButton/ThemedButton';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { 
  shareVerseAsText, 
  shareVerseAsImage, 
  shareTranslationVerseAsText,
  shareTranslationVerseAsImage,
  storeShareData, 
  getDownloadLinkText 
} from '@/services/shareService';

interface ShareButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string; // Required for regular verses, can be empty for translation-only
  translation: string;
  speaker: string;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
  verseViewRef?: React.RefObject<View | null>;
  isTranslationOnly?: boolean; // Flag to indicate if this is translation-only (no original verse text)
  onCaptureStart?: () => void; // Callback when image capture starts (to hide button)
  onCaptureEnd?: () => void; // Callback when image capture ends (to show button)
  hideDuringCapture?: boolean; // Flag to hide button during capture
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  verseId,
  chapterId,
  chapterNumber,
  verseNumber,
  verseText,
  translation,
  speaker,
  onAlert,
  verseViewRef,
  isTranslationOnly = false,
  onCaptureStart,
  onCaptureEnd,
  hideDuringCapture = false,
}) => {
  const { theme } = useTheme();
  const themeColors = useThemeColors();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { width, height } = Dimensions.get('window');

  const handleShareAsText = async () => {
    try {
      setIsSharing(true);
      
      // Store share data
      await storeShareData({
        verseId,
        chapterId,
        chapterNumber,
        verseNumber,
        verseText: isTranslationOnly ? undefined : verseText,
        translation,
        speaker,
        timestamp: Date.now(),
        isTranslationOnly,
      }, 'text');

      const success = isTranslationOnly
        ? await shareTranslationVerseAsText(
            translation,
            verseNumber,
            chapterNumber,
            speaker
          )
        : await shareVerseAsText(
            verseText,
            translation,
            verseNumber,
            chapterNumber,
            speaker
          );

      if (success) {
        onAlert?.(
          i18n.t('share.success'),
          i18n.t('share.textShared'),
          'success'
        );
      } else {
        onAlert?.(
          i18n.t('share.error'),
          i18n.t('share.shareFailed'),
          'error'
        );
      }
    } catch (error) {
      console.error('Error sharing as text:', error);
      onAlert?.(
        i18n.t('share.error'),
        i18n.t('share.shareFailed'),
        'error'
      );
    } finally {
      setIsSharing(false);
      setShowShareModal(false);
    }
  };

  const handleShareAsImage = async () => {
    try {
      setIsSharing(true);
      setShowShareModal(false); // Close modal before capture
      
      // Notify parent to hide the share button during capture
      onCaptureStart?.();
      
      // Small delay to ensure UI updates before capture
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!verseViewRef?.current) {
        onCaptureEnd?.(); // Restore button if capture fails
        onAlert?.(
          i18n.t('share.error'),
          i18n.t('share.imageCaptureFailed'),
          'error'
        );
        setIsSharing(false);
        return;
      }

      const success = isTranslationOnly
        ? await shareTranslationVerseAsImage(
            verseViewRef,
            verseId,
            chapterId,
            chapterNumber,
            verseNumber,
            translation,
            speaker
          )
        : await shareVerseAsImage(
            verseViewRef,
            verseId,
            chapterId,
            chapterNumber,
            verseNumber,
            verseText,
            translation,
            speaker
          );

      if (success) {
        const downloadLink = getDownloadLinkText();
        onAlert?.(
          i18n.t('share.success'),
          `${i18n.t('share.imageShared')}\n\n${downloadLink}`,
          'success'
        );
      } else {
        onAlert?.(
          i18n.t('share.error'),
          i18n.t('share.shareFailed'),
          'error'
        );
      }
    } catch (error) {
      console.error('Error sharing as image:', error);
      onAlert?.(
        i18n.t('share.error'),
        i18n.t('share.shareFailed'),
        'error'
      );
    } finally {
      // Restore button visibility after capture
      onCaptureEnd?.();
      setIsSharing(false);
    }
  };

  // Hide button during capture if flag is set
  if (hideDuringCapture) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowShareModal(true)}
        disabled={isSharing}
      >
        <Ionicons 
          name="share-social-outline" 
          size={SIZES.icon.xxl} 
          color={theme.icon.secondary} 
        />
      </TouchableOpacity>

      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowShareModal(false)}
      >
        <View style={[styles.modalOverlay, { width, height }]}>
          <TouchableWithoutFeedback onPress={() => setShowShareModal(false)}>
            <BlurView
              intensity={80}
              tint="dark"
              style={[styles.blurView, { width, height }]}
            >
              <View style={[styles.blurOverlay, { width, height }]} />
            </BlurView>
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContentWrapper}>
            <TouchableWithoutFeedback>
              <ThemedCard
                variant="secondary"
                style={[
                  styles.modalContent,
                  {
                    backgroundColor: themeColors.background.secondary,
                    shadowColor: '#000',
                    shadowOffset: {
                      width: 0,
                      height: SIZES.shadow.xl,
                    },
                    shadowOpacity: 0.3,
                    shadowRadius: SIZES.shadow.lg,
                    elevation: 15,
                  },
                ]}
              >
            <ThemedLanguageText 
              fontFamily="regional_secondary" 
              variant="primary" 
              size="title"
              style={styles.modalTitle}
            >
              {i18n.t('share.title')}
            </ThemedLanguageText>

            <ThemedLanguageText 
              fontFamily="regional_secondary" 
              variant="secondary" 
              size="medium"
              style={styles.modalSubtitle}
            >
              {i18n.t('share.chooseOption')}
            </ThemedLanguageText>

            <ThemedView style={styles.buttonContainer}>
              <ThemedButton
                title={i18n.t('share.asText')}
                onPress={handleShareAsText}
                variant="primary"
                size="lg"
                icon={<Ionicons name="text-outline" size={24} color={theme.button.primary.text} />}
                style={styles.shareButton}
                disabled={isSharing}
              />

              <ThemedButton
                title={i18n.t('share.asImage')}
                onPress={handleShareAsImage}
                variant="secondary"
                size="lg"
                icon={<Ionicons name="image-outline" size={24} color={theme.button.secondary.text} />}
                style={styles.shareButton}
                disabled={isSharing}
              />
            </ThemedView>

            <ThemedButton
              title={i18n.t('common.cancel')}
              onPress={() => setShowShareModal(false)}
              variant="outline"
              size="md"
              style={styles.cancelButton}
              disabled={isSharing}
            />
              </ThemedCard>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  modalContentWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    position: 'relative',
  },
  modalContent: {
    borderRadius: SIZES.radius.xl,
    padding: SIZES.spacing.xl,
    width: '85%',
    maxWidth: 400,
  },
  modalTitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.sm,
  },
  modalSubtitle: {
    textAlign: 'center',
    marginBottom: SIZES.spacing.xl,
  },
  buttonContainer: {
    gap: SIZES.spacing.md,
    marginBottom: SIZES.spacing.lg,
  },
  shareButton: {
    width: '100%',
  },
  cancelButton: {
    width: '100%',
  },
});

