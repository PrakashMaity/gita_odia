import { PageHeader } from '@/components/shared';
import { ThemedCard } from '@/components/ui/ThemedCard/ThemedCard';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useThemeColors } from '@/hooks/useTheme';
import i18n from '@/lib/i18n';
import { LayoutImages } from '@/lib/utils/assets';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageBackground, ScrollView, TouchableOpacity, View } from 'react-native';
import { SoundSelector } from './components/SoundSelector';
import { TimerControls } from './components/TimerControls';
import { TimerDisplay } from './components/TimerDisplay';
import { styles } from './ReadingTimerScreen.styles';

type TimerState = 'idle' | 'running' | 'paused' | 'completed';
type SoundType = 'none' | 'bell' | 'chime' | 'om';

const TIMER_PRESETS = [5, 10, 15, 20, 30, 45, 60]; // in minutes

export const ReadingTimerScreen: React.FC = () => {
  const theme = useThemeColors();
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [selectedSound, setSelectedSound] = useState<SoundType>('bell');
  const [selectedPreset, setSelectedPreset] = useState<number>(15);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const soundInitialized = useRef(false);
  const { showAd } = useInterstitialAd();

  // Initialize audio
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

  // Timer countdown
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
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerState, timeLeft]);

  const handleTimerComplete = useCallback(async () => {
    setTimerState('completed');
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    
    if (selectedSound !== 'none' && soundInitialized.current) {
      playCompletionSound(selectedSound);
    }

    // Show interstitial ad after timer completion
    // Small delay to let user see completion state first
    setTimeout(() => {
      showAd();
    }, 1000);
  }, [selectedSound, showAd]);

  const playCompletionSound = (soundType: SoundType) => {
    if (!soundInitialized.current) return;

    try {
      let frequency = 800;
      let duration = 0.5;

      switch (soundType) {
        case 'bell':
          frequency = 1000;
          duration = 0.8;
          break;
        case 'chime':
          frequency = 1200;
          duration = 0.6;
          break;
        case 'om':
          frequency = 432; // Om frequency
          duration = 1.0;
          break;
        default:
          return;
      }

      const base64 = createToneBase64(frequency, duration);
      const player = createAudioPlayer(
        { uri: `data:audio/wav;base64,${base64}` },
        { keepAudioSessionActive: false }
      );
      player.volume = 0.7;
      player.play();
      setTimeout(() => {
        try {
          player.remove();
        } catch {
          // ignore cleanup errors
        }
      }, Math.ceil(duration * 1000) + 200);
    } catch {
      // ignore playback errors
    }
  };

  const createToneBase64 = (frequency: number, duration: number) => {
    const sampleRate = 44100;
    const numSamples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + numSamples * 2);
    const view = new DataView(buffer);

    const writeString = (offset: number, value: string) => {
      for (let i = 0; i < value.length; i++) {
        view.setUint8(offset + i, value.charCodeAt(i));
      }
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
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const handleStart = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedPreset * 60);
    }
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
    if (timerState === 'completed') {
      setTimeout(() => {
        showAd();
      }, 400);
    }
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
      style={styles.backgroundImage}
      resizeMode="cover"
      blurRadius={2.5}
    >
      <ThemedView variant="transparent" style={styles.container}>
        <PageHeader
          title={i18n.t('readingTimer.title')}
          subtitle={i18n.t('readingTimer.subtitle')}
          showBackButton={true}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Timer Display */}
          <TimerDisplay
            timeLeft={timeLeft}
            timerState={timerState}
            formatTime={formatTime}
          />

          {/* Preset Buttons */}
          {timerState === 'idle' && (
            <View style={styles.presetsContainer}>
              <ThemedLanguageText
                variant="secondary"
                size="medium"
                style={styles.presetsTitle}
                fontFamily="regional_secondary"
              >
                {i18n.t('readingTimer.selectDuration')}
              </ThemedLanguageText>
              <View style={styles.presetsGrid}>
                {TIMER_PRESETS.map((minutes) => (
                  <TouchableOpacity
                    key={minutes}
                    style={[
                      styles.presetButton,
                      {
                        backgroundColor: selectedPreset === minutes 
                          ? theme.button.primary.background 
                          : theme.background.secondary,
                        borderColor: selectedPreset === minutes 
                          ? theme.border.primary 
                          : theme.border.tertiary,
                      },
                    ]}
                    onPress={() => handlePresetSelect(minutes)}
                  >
                    <ThemedLanguageText
                      variant={selectedPreset === minutes ? 'primary' : 'secondary'}
                      size="medium"
                      style={[
                        styles.presetText,
                        {
                          color: selectedPreset === minutes 
                            ? theme.button.primary.text 
                            : theme.text.secondary,
                        },
                        selectedPreset === minutes && styles.presetTextActive,
                      ]}
                      fontFamily="regional_secondary"
                    >
                      {minutes} {i18n.t('readingTimer.minutes')}
                    </ThemedLanguageText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Timer Controls */}
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

          {/* Completion Message */}
          {timerState === 'completed' && (
            <ThemedCard variant="card" style={styles.completionCard}>
              <ThemedLanguageText
                variant="primary"
                size="title"
                style={styles.completionIcon}
                fontFamily="regional_secondary"
              >
                ✨
              </ThemedLanguageText>
              <ThemedLanguageText
                variant="primary"
                size="large"
                style={styles.completionText}
                fontFamily="regional_secondary"
              >
                {i18n.t('readingTimer.completed')}
              </ThemedLanguageText>
            </ThemedCard>
          )}
        </ScrollView>
      </ThemedView>
    </ImageBackground>
  );
};
