import { ProUpgradeModal } from '@/components/shared';
import { AppHeading } from '@/components/ui/AppHeading';
import { AppText } from '@/components/ui/AppText';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import { useVerseTextToSpeech, VerseItem } from '@/hooks/useVerseTextToSpeech';
import { getSpeakerImage } from '@/lib/utils/speakerUtils';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

interface AudioModalProps {
  visible: boolean;
  onClose: () => void;
  text?: string;
  verses?: VerseItem[];
  speaker?: string;
  speakerEnglish?: string;
  verseNumber?: string;
  title?: string;
  chapterNumber?: string | number;
}

export const AudioModal: React.FC<AudioModalProps> = ({
  visible,
  onClose,
  text,
  verses,
  speaker,
  speakerEnglish,
  verseNumber,
  title,
  chapterNumber,
}) => {
  const { width, height } = Dimensions.get('window');
  const theme = useThemeColors();

  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [totalVerses, setTotalVerses] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [currentSpeakerEnglish, setCurrentSpeakerEnglish] = useState<string | undefined>(undefined);
  const prevVerseIndexRef = useRef<number>(-1);

  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);

  // Animations
  const [slideUpAnim] = useState(new Animated.Value(height));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [pulseAnim] = useState(new Animated.Value(1)); // Speaker avatar pulse
  const [textFadeAnim] = useState(new Animated.Value(0)); // Text specific fade
  const [verseTransitionSlide] = useState(new Animated.Value(0)); // Horizontal slide between verses
  const [verseTransitionScale] = useState(new Animated.Value(1));
  const [waveformAnims] = useState(() => Array.from({ length: 7 }, () => new Animated.Value(8))); // 7 bars

  const { speak, speakVerses, stop, isSpeaking, isPaused, pause, resume } = useVerseTextToSpeech({
    onFinish: () => {
      setTimeout(() => {
        closeModal();
      }, 500);
    },
    onError: (error) => {
      if (error.message === 'PRO_REQUIRED') {
        setShowProModal(true);
      } else {
        console.error('TTS Error:', error);
      }
    },
    onVerseStart: (verseIndex, total) => {
      setCurrentVerseIndex(verseIndex);
      setTotalVerses(total);

      // Text fade out quickly
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setCurrentText(''));
    },
    onVerseComplete: (verseIndex, total) => {
      setCurrentVerseIndex(verseIndex);
    },
    onLanguageStart: (newText, verseIndex) => {
      updateTextWithFade(newText, verseIndex);
    },
    onLanguageComplete: () => { },
    onTranslationStart: (newText, verseIndex) => {
      updateTextWithFade(newText, verseIndex);
    },
    onTranslationComplete: () => {
      Animated.timing(textFadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setCurrentText(''));
    },
  });

  const updateTextWithFade = (newText: string, verseIndex: number) => {
    Animated.timing(textFadeAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => {
      setCurrentText(newText);
      if (verses && verses.length > 0 && verseIndex > 0) {
        const verseIdx = verseIndex - 1;
        if (verseIdx >= 0 && verseIdx < verses.length) {
          setCurrentSpeakerEnglish(verses[verseIdx].speakerEnglish);
        }
      }
      Animated.timing(textFadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  };

  // Entrance & Exit
  const openModal = () => {
    Animated.parallel([
      Animated.spring(slideUpAnim, {
        toValue: 0,
        useNativeDriver: true,
        damping: 25,
        stiffness: 250,
        mass: 0.8,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    if (verses && verses.length > 0) {
      setTotalVerses(verses.length);
      setCurrentVerseIndex(0);
      setTimeout(() => speakVerses(verses), 400);
    } else if (text) {
      setTotalVerses(0);
      setCurrentVerseIndex(0);
      setTimeout(() => speak(text, speakerEnglish), 400);
    }
  };

  const closeModal = () => {
    stop();
    Animated.parallel([
      Animated.timing(slideUpAnim, {
        toValue: height,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      resetState();
      onClose();
    });
  };

  const resetState = () => {
    slideUpAnim.setValue(height);
    fadeAnim.setValue(0);
    pulseAnim.setValue(1);
    textFadeAnim.setValue(0);
    verseTransitionSlide.setValue(0);
    verseTransitionScale.setValue(1);
    waveformAnims.forEach((anim) => anim.setValue(8));
    setCurrentVerseIndex(0);
    setTotalVerses(0);
    setCurrentText('');
    setCurrentSpeakerEnglish(undefined);
    prevVerseIndexRef.current = -1;
  };

  useEffect(() => {
    if (visible) openModal();
    else stop();
    return () => { stop(); };
  }, [visible, text, verses, speakerEnglish]);

  // Verse Transition Animation (Slide Out & Slide In)
  useEffect(() => {
    if (currentVerseIndex !== prevVerseIndexRef.current && prevVerseIndexRef.current >= 0 && verses && verses.length > 0) {
      Animated.sequence([
        Animated.parallel([
          Animated.timing(verseTransitionSlide, { toValue: -width * 0.2, duration: 250, useNativeDriver: true }),
          Animated.timing(textFadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        ]),
        Animated.timing(verseTransitionSlide, { toValue: width * 0.2, duration: 0, useNativeDriver: true }),
        Animated.parallel([
          Animated.spring(verseTransitionSlide, { toValue: 0, useNativeDriver: true, damping: 20, stiffness: 200 }),
          Animated.timing(textFadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        ]),
      ]).start();
    }
    prevVerseIndexRef.current = currentVerseIndex;
  }, [currentVerseIndex]);

  // Pulsing Avatar & Waveform
  useEffect(() => {
    let pulseLoop: Animated.CompositeAnimation;
    let waveLoop: Animated.CompositeAnimation;

    if (isSpeaking && !isPaused) {
      // 1. Slow steady pulse for the avatar
      pulseLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, { toValue: 1.08, duration: 1500, useNativeDriver: true }),
          Animated.timing(pulseAnim, { toValue: 1, duration: 1500, useNativeDriver: true }),
        ])
      );
      pulseLoop.start();

      // 2. Dynamic 7-bar waveform
      const waveAnimations = waveformAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 24 + Math.random() * 24 + (index === 3 ? 12 : 0), // center bar is tallest
              duration: 250 + Math.random() * 150,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 8,
              duration: 250 + Math.random() * 150,
              useNativeDriver: false,
            }),
          ])
        )
      );
      waveLoop = Animated.parallel(waveAnimations);
      waveLoop.start();
    } else {
      pulseAnim.setValue(1);
      waveformAnims.forEach((anim) => anim.setValue(8));
    }

    return () => {
      pulseLoop?.stop();
      waveLoop?.stop();
    };
  }, [isSpeaking, isPaused]);

  const handlePauseResume = () => {
    if (isPaused) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      resume();
    } else if (isSpeaking) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      pause();
    }
  };

  if (!visible) return null;

  const currentDisplaySpeaker = currentSpeakerEnglish || speakerEnglish;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={closeModal}
    >
      <View style={{ flex: 1, width, height }}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <Animated.View style={{ position: 'absolute', width, height, opacity: fadeAnim }}>
            <BlurView intensity={90} tint="light" style={{ flex: 1 }}>
              <View style={{ flex: 1, backgroundColor: theme.background.primary, opacity: 0.85 }} />
            </BlurView>
          </Animated.View>
        </TouchableWithoutFeedback>

        <Animated.View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            paddingTop: 60,
            paddingBottom: 40,
            paddingHorizontal: 24,
            transform: [{ translateY: slideUpAnim }],
          }}
          pointerEvents="box-none"
        >
          <View className="flex-row items-center justify-between z-10">
            <TouchableOpacity
              onPress={closeModal}
              className="w-12 h-12 rounded-full items-center justify-center shadow-sm"
              style={{
                backgroundColor: theme.background.primary,
                borderWidth: 1,
                borderColor: theme.border.primary + '30',
              }}
            >
              <MaterialIcons name="keyboard-arrow-down" size={32} color={theme.text.primary} />
            </TouchableOpacity>

            <View
              className="px-5 py-2.5 rounded-full shadow-sm"
              style={{
                backgroundColor: theme.background.primary,
                borderWidth: 1,
                borderColor: theme.border.primary + '30',
              }}
            >
              <AppText variant="secondary" bold style={{ color: theme.text.primary }}>
                {totalVerses > 0 && currentVerseIndex > 0
                  ? `Verse ${currentVerseIndex} of ${totalVerses}`
                  : title || 'Audio Playback'}
              </AppText>
            </View>
            <View className="w-12 h-12" />
          </View>

          <Animated.View
            className="flex-1 items-center justify-center mt-12"
            style={{
              transform: [{ translateX: verseTransitionSlide }],
            }}
          >
            {!!currentDisplaySpeaker ? (
              <View className="items-center mb-10">
                <Animated.View
                  style={{
                    position: 'absolute',
                    width: 140,
                    height: 140,
                    borderRadius: 70,
                    backgroundColor: theme.background.quaternary,
                    opacity: 0.5,
                    transform: [{ scale: pulseAnim }],
                  }}
                />
                <Image
                  source={getSpeakerImage(currentDisplaySpeaker)}
                  className="w-32 h-32 rounded-full shadow-xl"
                  style={{
                    borderWidth: 3,
                    borderColor: theme.border.primary,
                  }}
                  resizeMode="cover"
                />
                <AppHeading variant="card" className="mt-4" style={{ color: theme.text.primary }}>
                  {speaker || currentDisplaySpeaker}
                </AppHeading>
                {!!verseNumber ? (
                  <AppText variant="caption" style={{ color: theme.text.secondary }}>
                    Verse {verseNumber}
                  </AppText>
                ) : null}
              </View>
            ) : null}

            <Animated.View style={{ opacity: textFadeAnim, width: '100%', minHeight: 140 }} className="items-center justify-center">
              {currentText ? (
                <AppHeading
                  variant="section"
                  className="text-center font-bold"
                  style={{ color: theme.text.primary, fontSize: 24, lineHeight: 38 }}
                >
                  {currentText}
                </AppHeading>
              ) : (
                <AppText
                  variant="body"
                  className="text-center"
                  style={{ color: theme.text.disabled }}
                >
                  {text || (verses && verses.length > 0 ? 'Preparing audio...' : '')}
                </AppText>
              )}
            </Animated.View>
          </Animated.View>

          <View className="items-center">
            <View className="flex-row items-center justify-center h-16 mb-8 space-x-1.5">
              {waveformAnims.map((anim, index) => (
                <Animated.View
                  key={index}
                  style={{
                    width: 5,
                    borderRadius: 3,
                    backgroundColor: theme.icon.primary,
                    height: anim,
                    opacity: isSpeaking ? 0.9 : 0.3,
                    marginHorizontal: 3,
                  }}
                />
              ))}
            </View>

            <View className="flex-row items-center justify-center w-full mb-6">
              <TouchableOpacity
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  closeModal();
                }}
                className="w-20 h-20 rounded-full items-center justify-center shadow-sm"
                style={{
                  backgroundColor: theme.background.primary,
                  borderWidth: 2,
                  borderColor: theme.status.error + '50',
                }}
              >
                <MaterialIcons name="stop" size={36} color={theme.status.error} />
              </TouchableOpacity>
            </View>

            <AppText variant="caption" className="uppercase tracking-widest mt-4" style={{ color: theme.text.disabled }}>
              {isSpeaking && !isPaused ? 'Chanting...' : isPaused ? 'Paused' : 'Ready'}
            </AppText>
          </View>
        </Animated.View>
      </View>
      <ProUpgradeModal visible={showProModal} onClose={() => setShowProModal(false)} />
    </Modal>
  );
};
