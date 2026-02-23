import { Box } from '@/components/ui/box';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import {
  getDownloadLinkText,
  shareTranslationVerseAsImage,
  shareTranslationVerseAsText,
  shareVerseAsImage,
  shareVerseAsText,
  storeShareData
} from '@/services/shareService';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Dimensions, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface ShareButtonProps {
  verseId: string;
  chapterId: string;
  chapterNumber: string;
  verseNumber: string;
  verseText: string;
  translation: string;
  speaker: string;
  onAlert?: (title: string, message: string, type?: 'success' | 'error') => void;
  verseViewRef?: React.RefObject<View | null>;
  isTranslationOnly?: boolean;
  onCaptureStart?: () => void;
  onCaptureEnd?: () => void;
  hideDuringCapture?: boolean;
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
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const { width, height } = Dimensions.get('window');

  const handleShareAsText = async () => {
    try {
      setIsSharing(true);

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
      setShowShareModal(false);

      onCaptureStart?.();

      await new Promise(resolve => setTimeout(resolve, 100));

      if (!verseViewRef?.current) {
        onCaptureEnd?.();
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
      onCaptureEnd?.();
      setIsSharing(false);
    }
  };

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
          color="#9ca3af" // neutral-400 equivalent for secondary icon color 
        />
      </TouchableOpacity>

      <Modal
        visible={showShareModal}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setShowShareModal(false)}
      >
        <View className="flex-1 justify-center items-center absolute inset-0">
          <TouchableWithoutFeedback onPress={() => setShowShareModal(false)}>
            <BlurView
              intensity={80}
              tint="dark"
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, width, height }}
            >
              <View className="absolute inset-0 bg-black/30 w-full h-full" />
            </BlurView>
          </TouchableWithoutFeedback>

          <View className="w-full justify-center items-center z-50">
            <TouchableWithoutFeedback>
              <Box
                className="bg-neutral-900 rounded-3xl p-6 w-[85%] max-w-[400px] shadow-2xl elevation-15 border border-neutral-800"
              >
                <Text
                  className="text-white text-2xl font-bold text-center mb-2 font-regional_secondary"
                >
                  {i18n.t('share.title')}
                </Text>

                <Text
                  className="text-neutral-400 text-base text-center mb-6 font-regional_secondary"
                >
                  {i18n.t('share.chooseOption')}
                </Text>

                <View className="gap-4 mb-6">
                  <Button
                    onPress={handleShareAsText}
                    className="w-full h-14 rounded-xl bg-white"
                    disabled={isSharing}
                  >
                    <ButtonIcon as={() => <Ionicons name="text-outline" size={24} color="black" className="mr-2" />} />
                    <ButtonText className="text-black font-semibold text-base font-regional_secondary">
                      {i18n.t('share.asText')}
                    </ButtonText>
                  </Button>

                  <Button
                    onPress={handleShareAsImage}
                    className="w-full h-14 rounded-xl bg-neutral-800 border-0"
                    disabled={isSharing}
                  >
                    <ButtonIcon as={() => <Ionicons name="image-outline" size={24} color="white" className="mr-2" />} />
                    <ButtonText className="text-white font-semibold text-base font-regional_secondary">
                      {i18n.t('share.asImage')}
                    </ButtonText>
                  </Button>
                </View>

                <Button
                  onPress={() => setShowShareModal(false)}
                  variant="outline"
                  className="w-full h-12 rounded-xl border border-neutral-700 bg-transparent"
                  disabled={isSharing}
                >
                  <ButtonText className="text-white font-semibold font-regional_secondary">
                    {i18n.t('common.cancel')}
                  </ButtonText>
                </Button>
              </Box>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Modal>
    </>
  );
};
