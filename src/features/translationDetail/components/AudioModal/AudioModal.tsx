import { ProUpgradeModal } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { useProStatus } from '@/hooks/useProStatus';
import { useThemeColors } from '@/hooks/useTheme';
import { useVerseTextToSpeech, VerseItem } from '@/hooks/useVerseTextToSpeech';
import { getChapterColors, getVerseColors } from '@/lib/utils/chapterColors';
import { getSpeakerImage } from '@/lib/utils/speakerUtils';
import { SIZES } from '@/rootconstants/sizes';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { styles } from './AudioModal.styles';

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
  const theme = useThemeColors();
  const screenData = Dimensions.get('screen');
  const { width, height } = screenData;

  const [currentVerseIndex, setCurrentVerseIndex] = useState<number>(0);
  const [totalVerses, setTotalVerses] = useState<number>(0);
  const [currentText, setCurrentText] = useState<string>('');
  const [currentSpeakerEnglish, setCurrentSpeakerEnglish] = useState<string | undefined>(undefined);
  const prevVerseIndexRef = useRef<number>(-1);

  const { isPro } = useProStatus();
  const [showProModal, setShowProModal] = useState(false);
  const { speak, speakVerses, stop, isSpeaking, isPaused, pause, resume } = useVerseTextToSpeech({
    onFinish: () => {
      // Automatically close modal when speech finishes
      setTimeout(() => {
        onClose();
      }, 300);
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
      // Clear previous text when new verse starts
      setCurrentText('');
    },
    onVerseComplete: (verseIndex, total) => {
      // Verse completed, next one will start automatically
      setCurrentVerseIndex(verseIndex);
    },
    onLanguageStart: (text, verseIndex) => {
      setCurrentText(text);
      // Get speaker from current verse (verseIndex is 1-based)
      if (verses && verses.length > 0 && verseIndex > 0) {
        const verseIdx = verseIndex - 1; // Convert to 0-based
        if (verseIdx >= 0 && verseIdx < verses.length) {
          const currentVerse = verses[verseIdx];
          setCurrentSpeakerEnglish(currentVerse.speakerEnglish);
        }
      }
    },
    onLanguageComplete: () => {
      // Don't clear text immediately, wait for translation or next verse
    },
    onTranslationStart: (text, verseIndex) => {
      setCurrentText(text);
      // Get speaker from current verse (verseIndex is 1-based)
      if (verses && verses.length > 0 && verseIndex > 0) {
        const verseIdx = verseIndex - 1; // Convert to 0-based
        if (verseIdx >= 0 && verseIdx < verses.length) {
          const currentVerse = verses[verseIdx];
          setCurrentSpeakerEnglish(currentVerse.speakerEnglish);
        }
      }
    },
    onTranslationComplete: () => {
      // Clear text when translation completes
      setCurrentText('');
    },
  });

  const [scaleAnim] = useState(new Animated.Value(0));
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(0));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleTransitionAnim] = useState(new Animated.Value(1));
  const [fadeTransitionAnim] = useState(new Animated.Value(1));
  const [waveformAnims] = useState(() =>
    Array.from({ length: 5 }, () => new Animated.Value(20))
  );

  // Combined animated values for scale and opacity
  const combinedScale = useMemo(
    () => Animated.multiply(scaleAnim, scaleTransitionAnim),
    [scaleAnim, scaleTransitionAnim]
  );
  const combinedOpacity = useMemo(
    () => Animated.multiply(fadeAnim, fadeTransitionAnim),
    [fadeAnim, fadeTransitionAnim]
  );
  const rotateInterpolated = useMemo(
    () =>
      rotateAnim.interpolate({
        inputRange: [-15, 0, 15],
        outputRange: ['-15deg', '0deg', '15deg'],
      }),
    [rotateAnim]
  );

  // Get verse-based colors that change with each verse
  const verseColors = useMemo(() => {
    if (currentVerseIndex > 0) {
      return getVerseColors(currentVerseIndex, chapterNumber);
    }
    // Fallback to chapter colors if no verse is playing yet
    return chapterNumber ? getChapterColors(chapterNumber) : null;
  }, [currentVerseIndex, chapterNumber]);

  useEffect(() => {
    if (visible) {
      // Start animation
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();

      // Automatically start speaking when modal opens
      if (verses && verses.length > 0) {
        // Play verses with speaker-specific voices
        setTotalVerses(verses.length);
        setCurrentVerseIndex(0);
        setTimeout(() => {
          speakVerses(verses);
        }, 300);
      } else if (text) {
        // Play single text
        setTotalVerses(0);
        setCurrentVerseIndex(0);
        setTimeout(() => {
          speak(text, speakerEnglish);
        }, 300);
      }
    } else {
      // Reset animation
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
      rotateAnim.setValue(0);
      scaleTransitionAnim.setValue(1);
      fadeTransitionAnim.setValue(1);
      waveformAnims.forEach(anim => anim.setValue(20));
      setCurrentVerseIndex(0);
      setTotalVerses(0);
      setCurrentText('');
      setCurrentSpeakerEnglish(undefined);
      prevVerseIndexRef.current = -1;
      // Stop speaking when modal closes
      stop();
    }

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, text, verses, speakerEnglish]);

  // Creative slide animation effect when verse completes
  useEffect(() => {
    // Only animate if verse index changed and it's not the initial load
    if (currentVerseIndex !== prevVerseIndexRef.current && prevVerseIndexRef.current >= 0 && verses && verses.length > 0) {
      // Reset transition animations
      scaleTransitionAnim.setValue(1);
      fadeTransitionAnim.setValue(1);
      rotateAnim.setValue(0);

      // Creative animation: slide out with rotation and scale, then slide in with bounce
      Animated.sequence([
        // Phase 1: Slide out to left with rotation, scale down, and fade
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: -width * 0.5,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: -15,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(scaleTransitionAnim, {
            toValue: 0.7,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(fadeTransitionAnim, {
            toValue: 0.3,
            duration: 250,
            useNativeDriver: true,
          }),
        ]),
        // Phase 2: Instantly reset to right side (invisible)
        Animated.parallel([
          Animated.timing(slideAnim, {
            toValue: width * 0.5,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 15,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(scaleTransitionAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(fadeTransitionAnim, {
            toValue: 0.3,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        // Phase 3: Slide in with elastic bounce, rotate back, scale up, and fade in
        Animated.parallel([
          Animated.spring(slideAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
            velocity: 0.5,
          }),
          Animated.spring(rotateAnim, {
            toValue: 0,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
          }),
          Animated.spring(scaleTransitionAnim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 7,
          }),
          Animated.timing(fadeTransitionAnim, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    }
    prevVerseIndexRef.current = currentVerseIndex;
  }, [currentVerseIndex, verses, slideAnim, rotateAnim, scaleTransitionAnim, fadeTransitionAnim, width]);

  // Waveform animation effect
  useEffect(() => {
    if (isSpeaking && !isPaused) {
      // Start waveform animations
      const animations = waveformAnims.map((anim, index) =>
        Animated.loop(
          Animated.sequence([
            Animated.timing(anim, {
              toValue: 40 + index * 5,
              duration: 300 + index * 50,
              useNativeDriver: false,
            }),
            Animated.timing(anim, {
              toValue: 20,
              duration: 300 + index * 50,
              useNativeDriver: false,
            }),
          ])
        )
      );
      const parallelAnim = Animated.parallel(animations);
      parallelAnim.start();

      return () => {
        parallelAnim.stop();
        waveformAnims.forEach(anim => {
          anim.stopAnimation();
          anim.setValue(20);
        });
      };
    } else {
      // Reset waveform to base height
      waveformAnims.forEach(anim => {
        anim.stopAnimation();
        anim.setValue(20);
      });
    }
  }, [isSpeaking, isPaused, waveformAnims]);

  const handleBackdropPress = () => {
    stop();
    onClose();
  };

  const handleStop = () => {
    stop();
    onClose();
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resume();
    } else if (isSpeaking) {
      pause();
    }
  };

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleBackdropPress}
    >
      <View style={[styles.backdrop, { width, height }]}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <BlurView
            intensity={80}
            tint="dark"
            style={[styles.backdropTouchable, { width, height }]}
          >
            <View style={[styles.blurOverlay, { width, height, backgroundColor: 'rgba(0, 0, 0, 0.4)' }]} />
          </BlurView>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                backgroundColor: theme.background.secondary,
                maxWidth: width * 0.9,
                transform: [
                  { scale: combinedScale },
                  { translateX: slideAnim },
                  { rotate: rotateInterpolated },
                ],
                opacity: combinedOpacity,
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
            <ThemedCard
              variant="card"
              style={[
                styles.card,
                ...(verseColors
                  ? [
                    {
                      borderColor: verseColors.primary,
                      borderWidth: 2,
                    },
                  ]
                  : []),
              ]}
              borderVariant="none"
            >
              {verseColors && verseColors.gradient.length >= 2 && (
                <LinearGradient
                  colors={verseColors.gradient as unknown as readonly [string, string, ...string[]]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientBackground}
                />
              )}
              {/* Header */}
              <View style={styles.header}>
                {speakerEnglish ? (
                  <View style={styles.speakerContainer}>
                    <Image
                      source={getSpeakerImage(speakerEnglish)}
                      style={styles.speakerAvatar}
                      resizeMode="cover"
                    />
                    <View style={styles.speakerInfo}>
                      <ThemedLanguageText
                        variant="primary"
                        size="medium"
                        fontFamily="regional_secondary"
                        style={styles.speakerName}
                      >
                        {speaker || speakerEnglish}
                      </ThemedLanguageText>
                      <ThemedLanguageText
                        variant="secondary"
                        size="small"
                        fontFamily="regional_secondary"
                        style={styles.verseNumber}
                      >
                        {verseNumber ? `Verse ${verseNumber}` : 'Chanting...'}
                      </ThemedLanguageText>
                    </View>
                  </View>
                ) : (
                  <View style={styles.titleContainer}>
                    <ThemedLanguageText
                      variant="primary"
                      size="large"
                      fontFamily="regional_secondary"
                      style={styles.title}
                    >
                      {title || 'Audio Playback'}
                    </ThemedLanguageText>
                    {totalVerses > 0 && currentVerseIndex > 0 && (
                      <ThemedLanguageText
                        variant="secondary"
                        size="small"
                        fontFamily="regional_secondary"
                        style={styles.verseProgress}
                      >
                        Verse {currentVerseIndex} of {totalVerses}
                      </ThemedLanguageText>
                    )}
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleBackdropPress}
                  style={[
                    styles.closeButton,
                    {
                      backgroundColor: verseColors
                        ? `${verseColors.primary}20`
                        : 'rgba(0, 0, 0, 0.05)',
                    },
                  ]}
                >
                  <MaterialIcons
                    name="close"
                    size={20}
                    color={verseColors ? verseColors.primary : theme.icon.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Audio Waveform Animation */}
              <View style={styles.waveformContainer}>
                {waveformAnims.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={[
                      styles.waveformBar,
                      {
                        backgroundColor: verseColors
                          ? verseColors.primary
                          : theme.icon.primary,
                        height: anim,
                        opacity: isSpeaking ? 0.8 : 0.3,
                      },
                    ]}
                  />
                ))}
              </View>

              {/* Current Text Display with Speaker Icon */}
              <View style={styles.textContainer}>
                {currentText ? (
                  <View style={styles.currentTextContainer}>
                    {currentSpeakerEnglish && (
                      <Image
                        source={getSpeakerImage(currentSpeakerEnglish)}
                        style={styles.speakerIconSmall}
                        resizeMode="cover"
                      />
                    )}
                    <ThemedLanguageText
                      variant="primary"
                      size="large"
                      fontFamily="regional_secondary"
                      style={styles.currentText}
                      numberOfLines={4}
                    >
                      {currentText}
                    </ThemedLanguageText>
                  </View>
                ) : (
                  <ThemedLanguageText
                    variant="secondary"
                    size="medium"
                    fontFamily="regional_secondary"
                    style={styles.textPreview}
                  >
                    {text || (verses && verses.length > 0 ? `${verses.length} verses loaded` : 'Preparing audio...')}
                  </ThemedLanguageText>
                )}
              </View>

              {/* Controls */}
              <View style={styles.controlsContainer}>
                <TouchableOpacity
                  onPress={handleStop}
                  style={[
                    styles.controlButton,
                    styles.stopButton,
                    { backgroundColor: 'rgba(239, 68, 68, 0.1)' },
                  ]}
                >
                  <MaterialIcons
                    name="stop"
                    size={24}
                    color="#EF4444"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    handlePauseResume();
                  }}
                  style={[
                    styles.controlButton,
                    {
                      backgroundColor: verseColors
                        ? verseColors.primary
                        : theme.button.primary.background,
                    },
                  ]}
                >
                  <MaterialIcons
                    name={isPaused || !isSpeaking ? 'play-arrow' : 'pause'}
                    size={40}
                    color={theme.button.primary.text}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Add logic for next/prev if needed, but for now just a placeholder
                  }}
                  style={[
                    styles.controlButton,
                    styles.stopButton,
                    { backgroundColor: 'rgba(0, 0, 0, 0.05)' },
                  ]}
                >
                  <MaterialIcons
                    name="skip-next"
                    size={24}
                    color={theme.icon.primary}
                  />
                </TouchableOpacity>
              </View>

              {/* Status and Progress */}
              <View style={styles.statusContainer}>
                {totalVerses > 0 && currentVerseIndex > 0 ? (
                  <View style={styles.progressContainer}>
                    <ThemedLanguageText
                      variant="primary"
                      size="medium"
                      fontFamily="regional_secondary"
                      style={styles.progressText}
                    >
                      Playing {currentVerseIndex} of {totalVerses}
                    </ThemedLanguageText>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${(currentVerseIndex / totalVerses) * 100}%`,
                            backgroundColor: verseColors
                              ? verseColors.primary
                              : theme.icon.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ) : (
                  <ThemedLanguageText
                    variant="secondary"
                    size="small"
                    fontFamily="regional_secondary"
                    style={styles.statusText}
                  >
                    {isSpeaking && !isPaused
                      ? 'Chanting...'
                      : isPaused
                        ? 'Paused'
                        : 'Ready'}
                  </ThemedLanguageText>
                )}
              </View>
            </ThemedCard>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
      <ProUpgradeModal
        visible={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </Modal>
  );
};

