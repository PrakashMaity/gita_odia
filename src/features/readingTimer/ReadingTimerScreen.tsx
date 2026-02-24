import { useSemanticColors } from '@/hooks/useSemanticColors';
import { PageHeader } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { LayoutImages } from '@/lib/utils/assets';
import { getLanguageFonts } from '@/types/font.interface';
import { FontAwesome5 } from '@expo/vector-icons';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, ImageBackground, ScrollView } from 'react-native';
import { SoundSelector } from './components/SoundSelector';
import { TimerControls } from './components/TimerControls';
import { TimerDisplay } from './components/TimerDisplay';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type SoundType = 'none' | 'bell' | 'chime' | 'om';

const TIMER_PRESETS = [5, 10, 15, 20, 30, 45, 60];

export const ReadingTimerScreen: React.FC = () => {
  const { colors } = useSemanticColors();
  const { width, height } = Dimensions.get('window');
  const theme = useThemeColors();
  const fonts = getLanguageFonts();
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [selectedSound, setSelectedSound] = useState<SoundType>('bell');
  const [selectedPreset, setSelectedPreset] = useState<number>(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundInitialized = useRef(false);
  const { showAd } = useInterstitialAd();

  useEffect(() => {
    const setupAudio = async () => {
      try {
        await setAudioModeAsync({
          allowsRecording: false,
          shouldPlayInBackground: false,
          playsInSilentMode: true,
          interruptionMode: 'duckOthers',
          interruptionModeAndroid: 'duckOthers',
          shouldRouteThroughEarpiece: false,
        });
        soundInitialized.current = true;
      } catch (error) {
        console.error('Audio setup error:', error);
      }
    };
    setupAudio();
  }, []);

  useEffect(() => {
    if (timerState === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerState, timeLeft]);

  const handleTimerComplete = useCallback(async () => {
    setTimerState('completed');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    if (selectedSound !== 'none' && soundInitialized.current) {
      playCompletionSound(selectedSound);
    }
    setTimeout(() => { showAd(); }, 1000);
  }, [selectedSound, showAd]);

  const playCompletionSound = (soundType: SoundType) => {
    if (!soundInitialized.current) return;
    try {
      let frequency = 800;
      let duration = 0.5;
      switch (soundType) {
        case 'bell': frequency = 1000; duration = 0.8; break;
        case 'chime': frequency = 1200; duration = 0.6; break;
        case 'om': frequency = 432; duration = 1.0; break;
        default: return;
      }
      const base64 = createToneBase64(frequency, duration);
      const player = createAudioPlayer(
        { uri: `data:audio/wav;base64,${base64}` },
        { keepAudioSessionActive: false }
      );
      player.volume = 0.7;
      player.play();
      setTimeout(() => {
        try { player.remove(); } catch { }
      }, Math.ceil(duration * 1000) + 200);
    } catch { }
  };

  const createToneBase64 = (frequency: number, duration: number) => {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);
    const writeString = (offset: number, value: string) => {
      for (let i = 0; i < value.length; i++) view.setUint8(offset + i, value.charCodeAt(i));
    };
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + numSamples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, numSamples * 2, true);
    for (let i = 0; i < numSamples; i++) {
      const sample = Math.sin((2 * Math.PI * frequency * i) / sampleRate) * 0.4;
      const intSample = Math.max(-1, Math.min(1, sample));
      view.setInt16(44 + i * 2, intSample * 0x7fff, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const handleStart = () => {
    if (timeLeft === 0) setTimeLeft(selectedPreset * 60);
    setTimerState('running');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handlePause = () => {
    setTimerState('paused');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleResume = () => {
    setTimerState('running');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleReset = () => {
    if (timerState === 'completed') setTimeout(() => { showAd(); }, 400);
    setTimerState('idle');
    setTimeLeft(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handlePresetSelect = (minutes: number) => {
    if (timerState === 'idle') {
      setSelectedPreset(minutes);
      setTimeLeft(minutes * 60);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <ImageBackground
      source={LayoutImages.background2}
      className="flex-1"
      resizeMode="cover"
      blurRadius={1.5}
    >
      <Box className="flex-1" style={{ backgroundColor: theme.background.secondary + '80' }}>
        <PageHeader
          title={i18n.t('readingTimer.title')}
          subtitle={i18n.t('readingTimer.subtitle')}
          showBackButton={true}
        />

        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 64, paddingHorizontal: 24, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer Display */}
          <TimerDisplay
            timeLeft={timeLeft}
            timerState={timerState}
            formatTime={formatTime}
          />

          {/* Preset Selection - Pills Style */}
          {timerState === 'idle' && (
            <VStack className="w-full mt-4" space="md">
              <Text
                className="text-neutral-500 font-bold text-[14px] uppercase tracking-widest text-center"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('readingTimer.selectDuration')}
              </Text>
              <Box className="bg-white p-2 rounded-[28px] border border-primary-100 shadow-sm">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <HStack space="xs" className="px-1">
                    {TIMER_PRESETS.map((minutes) => {
                      const isActive = selectedPreset === minutes;
                      return (
                        <Pressable
                          key={minutes}
                          onPress={() => handlePresetSelect(minutes)}
                          className={`px-6 py-3 rounded-[20px] ${isActive ? 'bg-black shadow-sm' : 'bg-transparent'
                            }`}
                        >
                          <Text
                            className={`text-[14px] font-bold ${isActive ? 'text-white' : 'text-neutral-400'
                              }`}
                            style={{ fontFamily: fonts.regional_secondary }}
                          >
                            {minutes} {i18n.t('readingTimer.minutes')}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </HStack>
                </ScrollView>
              </Box>
            </VStack>
          )}

          {/* Controls */}
          <TimerControls
            timerState={timerState}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onReset={handleReset}
          />

          {/* Sound Selector */}
          <SoundSelector
            selectedSound={selectedSound}
            onSoundChange={setSelectedSound}
          />

          {/* Completion Reward Style Banner */}
          {timerState === 'completed' && (
            <Box
              className="mt-8 w-full p-8 rounded-[32px] border border-primary-200 bg-primary-50 items-center overflow-hidden"
              style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }}
            >
              <Box className="absolute -right-6 -bottom-6 opacity-10">
                <FontAwesome5 name="sparkles" size={100} color={colors.primary600} />
              </Box>
              <Text className="text-4xl mb-4">✨</Text>
              <Heading
                className="text-primary-900 text-2xl font-black text-center mb-2"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                {i18n.t('readingTimer.completed')}
              </Heading>
              <Text
                className="text-primary-700/60 font-medium text-center"
                style={{ fontFamily: fonts.regional_secondary }}
              >
                সাধনা সফলভাবে সম্পন্ন হয়েছে
              </Text>
            </Box>
          )}
        </ScrollView>
      </Box>
    </ImageBackground>
  );
};

export default ReadingTimerScreen;
