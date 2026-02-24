import { ProUpgradeModal } from '@/components/shared';
import { Text } from '@/components/ui/text';
import { useProStatus } from '@/hooks/useProStatus';
import { useVerseTextToSpeech, VerseItem } from '@/hooks/useVerseTextToSpeech';
import { getSpeakerImage } from '@/lib/utils/speakerUtils';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
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
      setCurrentText('');
    },
    onVerseComplete: (verseIndex, total) => {
      setCurrentVerseIndex(verseIndex);
    },
    onLanguageStart: (text, verseIndex) => {
      setCurrentText(text);
      if (verses && verses.length > 0 && verseIndex > 0) {
        const verseIdx = verseIndex - 1;
        if (verseIdx >= 0 && verseIdx < verses.length) {
          const currentVerse = verses[verseIdx];
          setCurrentSpeakerEnglish(currentVerse.speakerEnglish);
        }
      }
    },
    onLanguageComplete: () => { },
    onTranslationStart: (text, verseIndex) => {
      setCurrentText(text);
      if (verses && verses.length > 0 && verseIndex > 0) {
        const verseIdx = verseIndex - 1;
        if (verseIdx >= 0 && verseIdx < verses.length) {
          const currentVerse = verses[verseIdx];
          setCurrentSpeakerEnglish(currentVerse.speakerEnglish);
        }
      }
    },
    onTranslationComplete: () => {
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

  useEffect(() => {
    if (visible) {
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

      if (verses && verses.length > 0) {
        setTotalVerses(verses.length);
        setCurrentVerseIndex(0);
        setTimeout(() => {
          speakVerses(verses);
        }, 300);
      } else if (text) {
        setTotalVerses(0);
        setCurrentVerseIndex(0);
        setTimeout(() => {
          speak(text, speakerEnglish);
        }, 300);
      }
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
      slideAnim.setValue(0);
      rotateAnim.setValue(0);
      scaleTransitionAnim.setValue(1);
      fadeTransitionAnim.setValue(1);
      waveformAnims.forEach((anim) => anim.setValue(20));
      setCurrentVerseIndex(0);
      setTotalVerses(0);
      setCurrentText('');
      setCurrentSpeakerEnglish(undefined);
      prevVerseIndexRef.current = -1;
      stop();
    }

    return () => {
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, text, verses, speakerEnglish]);

  useEffect(() => {
    if (
      currentVerseIndex !== prevVerseIndexRef.current &&
      prevVerseIndexRef.current >= 0 &&
      verses &&
      verses.length > 0
    ) {
      scaleTransitionAnim.setValue(1);
      fadeTransitionAnim.setValue(1);
      rotateAnim.setValue(0);

      Animated.sequence([
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

  useEffect(() => {
    if (isSpeaking && !isPaused) {
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
        waveformAnims.forEach((anim) => {
          anim.stopAnimation();
          anim.setValue(20);
        });
      };
    } else {
      waveformAnims.forEach((anim) => {
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
      <View style={{ flex: 1, width, height, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <BlurView
            intensity={80}
            tint="dark"
            style={{ position: 'absolute', width, height }}
          >
            <View style={{ width, height, backgroundColor: 'rgba(0, 0, 0, 0.4)' }} />
          </BlurView>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback>
          <Animated.View
            style={{
              backgroundColor: '#171717', // neutral-900
              borderRadius: 32,
              borderWidth: 1,
              borderColor: '#262626', // neutral-800
              width: '90%',
              maxWidth: 400,
              overflow: 'hidden',
              transform: [
                { scale: combinedScale },
                { translateX: slideAnim },
                { rotate: rotateInterpolated },
              ],
              opacity: combinedOpacity,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 20 },
              shadowOpacity: 0.25,
              shadowRadius: 24,
              elevation: 15,
            }}
          >
            <View className="p-6">
              {/* Header */}
              <View className="flex-row items-center justify-between mb-8">
                {speakerEnglish ? (
                  <View className="flex-row items-center flex-1">
                    <Image
                      source={getSpeakerImage(speakerEnglish)}
                      className="w-12 h-12 rounded-full border-2 border-neutral-800 bg-black mr-4"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-white text-lg font-bold font-regional_secondary">
                        {speaker || speakerEnglish}
                      </Text>
                      <Text className="text-neutral-400 text-sm font-regional_secondary leading-5">
                        {verseNumber ? `Verse ${verseNumber}` : 'Chanting...'}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="flex-1">
                    <Text className="text-white text-xl font-bold font-regional_secondary">
                      {title || 'Audio Playback'}
                    </Text>
                    {totalVerses > 0 && currentVerseIndex > 0 && (
                      <Text className="text-neutral-400 text-sm font-regional_secondary mt-1">
                        Verse {currentVerseIndex} of {totalVerses}
                      </Text>
                    )}
                  </View>
                )}
                <TouchableOpacity
                  onPress={handleBackdropPress}
                  className="w-10 h-10 rounded-full items-center justify-center bg-black/20"
                >
                  <MaterialIcons name="close" size={20} color="white" />
                </TouchableOpacity>
              </View>

              {/* Audio Waveform Animation */}
              <View className="flex-row items-center justify-center h-16 mb-8 space-x-1.5">
                {waveformAnims.map((anim, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      width: 4,
                      borderRadius: 2,
                      backgroundColor: 'white',
                      height: anim,
                      opacity: isSpeaking ? 0.8 : 0.3,
                      marginHorizontal: 3,
                    }}
                  />
                ))}
              </View>

              {/* Current Text Display with Speaker Icon */}
              <View className="min-h-[100px] justify-center mb-8 px-2">
                {currentText ? (
                  <View>
                    {currentSpeakerEnglish && (
                      <Image
                        source={getSpeakerImage(currentSpeakerEnglish)}
                        className="w-6 h-6 rounded-full absolute -top-8 left-0 opacity-50"
                        resizeMode="cover"
                      />
                    )}
                    <Text
                      className="text-white text-2xl font-bold font-regional_secondary leading-relaxed text-center"
                      numberOfLines={4}
                    >
                      {currentText}
                    </Text>
                  </View>
                ) : (
                  <Text className="text-neutral-400 text-base font-regional_secondary text-center leading-relaxed">
                    {text ||
                      (verses && verses.length > 0
                        ? `${verses.length} verses loaded`
                        : 'Preparing audio...')}
                  </Text>
                )}
              </View>

              {/* Controls */}
              <View className="flex-row items-center justify-center space-x-8 mb-8">
                <TouchableOpacity
                  onPress={handleStop}
                  className="w-14 h-14 rounded-full items-center justify-center bg-tertiary-500/10 border border-tertiary-500/20 mr-8"
                >
                  <MaterialIcons name="stop" size={24} color="#EF4444" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    handlePauseResume();
                  }}
                  className="w-20 h-20 rounded-full items-center justify-center bg-white shadow-lg mx-2"
                >
                  <MaterialIcons
                    name={isPaused || !isSpeaking ? 'play-arrow' : 'pause'}
                    size={40}
                    color="black"
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    // Add logic for next/prev if needed, but for now just a placeholder
                  }}
                  className="w-14 h-14 rounded-full items-center justify-center bg-white/5 border border-white/10 ml-8"
                >
                  <MaterialIcons name="skip-next" size={24} color="white" />
                </TouchableOpacity>
              </View>

              {/* Status and Progress */}
              <View className="items-center justify-center pt-6 border-t border-neutral-800">
                {totalVerses > 0 && currentVerseIndex > 0 ? (
                  <View className="w-full flex-row items-center justify-between">
                    <Text className="text-white text-sm font-bold font-regional_secondary mb-2">
                      Playing {currentVerseIndex} of {totalVerses}
                    </Text>
                    <View className="flex-1 h-1.5 bg-neutral-800 rounded-full ml-4 overflow-hidden relative">
                      <View
                        style={{
                          width: `${(currentVerseIndex / totalVerses) * 100}%`,
                          height: '100%',
                          backgroundColor: 'white',
                          borderRadius: 9999,
                        }}
                      />
                    </View>
                  </View>
                ) : (
                  <Text className="text-neutral-400 text-xs font-regional_secondary tracking-wider uppercase">
                    {isSpeaking && !isPaused ? 'Chanting...' : isPaused ? 'Paused' : 'Ready'}
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>
      <ProUpgradeModal visible={showProModal} onClose={() => setShowProModal(false)} />
    </Modal>
  );
};
