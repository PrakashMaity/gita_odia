import { PageHeader, ProUpgradeModal } from '@/components/shared';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import i18n from '@/lib/i18n';
import { SIZES } from '@/rootconstants/sizes';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View
} from 'react-native';
import { MalaBeads } from './components/MalaBeads';
import { MantraSelector } from './components/MantraSelector';
import { ProgressCards } from './components/ProgressCards';
import { SuccessModal } from './components/SuccessModal';

type MantraType = 'hareKrishna' | 'omNamah' | 'gitaDhyana' | 'custom';
type BeadCount = 27 | 54 | 108;

export const MalaJapaScreen: React.FC = () => {
  const [currentBead, setCurrentBead] = useState(0);
  const [beadCount, setBeadCount] = useState<BeadCount>(108);
  const [selectedMantra, setSelectedMantra] = useState<MantraType>('hareKrishna');
  const [completedMalas, setCompletedMalas] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  
  const soundInitialized = useRef(false);
  const { showAd } = useInterstitialAd();
  const lastAdShownJapa = useRef(0);
  const { isPro } = useProStatus();

  // Initialize TTS for mantra chanting
  const { speak: speakMantra, stop: stopMantra } = useTextToSpeech({
    language: getBengaliTTSLanguage(),
    rate: 1.0, // Normal rate for mantra chanting
    pitch: 1.0,
  });

  // Get mantra text based on selected mantra
  const getMantraText = useCallback((mantra: MantraType): string => {
    switch (mantra) {
      case 'hareKrishna':
        return i18n.t('malaJapa.mantras.hareKrishnaText');
      case 'omNamah':
        return i18n.t('malaJapa.mantras.omNamahText');
      case 'gitaDhyana':
        return i18n.t('malaJapa.mantras.gitaDhyanaText');
      case 'custom':
        return i18n.t('malaJapa.mantras.customText');
      default:
        return i18n.t('malaJapa.mantras.hareKrishnaText');
    }
  }, []);

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

  // Calculate current japa count
  const currentJapa = currentBead + completedMalas * beadCount;

  // Reset to first mantra if user loses pro status while using a locked mantra
  useEffect(() => {
    if (!isPro && selectedMantra !== 'hareKrishna') {
      setSelectedMantra('hareKrishna');
    }
  }, [isPro, selectedMantra]);

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

  const playTone = useCallback((frequency: number, duration: number, volume: number) => {
    if (!soundInitialized.current) {
      return;
    }

    try {
      const base64 = createToneBase64(frequency, duration);
      const player = createAudioPlayer(
        { uri: `data:audio/wav;base64,${base64}` },
        { keepAudioSessionActive: false }
      );
      player.volume = volume;
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
  }, []);

  // Play bead sound - simple beep
  const playBeadSound = useCallback(() => {
    playTone(800, 0.1, 0.3);
  }, [playTone]);

  // Play completion sound
  const playCompletionSound = useCallback(() => {
    playTone(1000, 0.2, 0.5);
  }, [playTone]);

  // Handle mantra change with pro check
  const handleMantraChange = useCallback((mantra: MantraType) => {
    // First mantra (hareKrishna) is always available
    if (mantra === 'hareKrishna') {
      setSelectedMantra(mantra);
      return;
    }
    
    // Other mantras require pro
    if (!isPro) {
      setShowProModal(true);
      return;
    }
    
    setSelectedMantra(mantra);
  }, [isPro]);

  // Handle bead tap with sound, vibration, and TTS mantra
  const handleBeadTap = useCallback(async () => {
    if (currentBead < beadCount - 1) {
      const newBead = currentBead + 1;
      setCurrentBead(newBead);
      
      // Vibration - always works
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Sound
      playBeadSound();
      
      // Chant mantra using TTS
      try {
        const mantraText = getMantraText(selectedMantra);
        if (mantraText) {
          // Stop any ongoing speech before starting new one
          await stopMantra();
          // Speak the mantra
          await speakMantra(mantraText);
        }
      } catch (error) {
        console.error('Error chanting mantra:', error);
        // Continue even if TTS fails
      }
    } else {
      // Complete one mala
      const newCompletedMalas = completedMalas + 1;
      const newTotalJapa = newCompletedMalas * beadCount;
      
      setCompletedMalas(newCompletedMalas);
      setCurrentBead(0);
      
      // Stronger vibration for completion
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Completion sound
      playCompletionSound();
      
      // Chant mantra one last time on completion
      try {
        const mantraText = getMantraText(selectedMantra);
        if (mantraText) {
          await stopMantra();
          await speakMantra(mantraText);
        }
      } catch (error) {
        console.error('Error chanting mantra on completion:', error);
      }
      
      // Show interstitial ad after completing 108 japa
      if (newTotalJapa === 108 && lastAdShownJapa.current < 108) {
        showAd();
        lastAdShownJapa.current = 108;
      }
      
      // Show success modal
      setShowSuccessModal(true);
    }
  }, [currentBead, beadCount, completedMalas, selectedMantra, getMantraText, speakMantra, stopMantra, showAd, playBeadSound, playCompletionSound]);

  return (
    <LinearGradient
      colors={['#FFE082', '#FFB74D', '#FF8F00']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ThemedView variant="transparent" style={styles.content}>
        <PageHeader
          title={i18n.t('malaJapa.title')}
          subtitle={i18n.t('malaJapa.subtitle')}
          showBackButton={false}
        />

        {/* Mantra Selector Tabs - Below Header */}
        <MantraSelector
          selectedMantra={selectedMantra}
          onMantraChange={handleMantraChange}
          isPro={isPro}
        />

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Mala Beads Interface */}
          <View style={styles.malaContainer}>
            <MalaBeads
              beadCount={beadCount}
              currentBead={currentBead}
              onBeadTap={handleBeadTap}
              selectedMantra={selectedMantra}
            />
          </View>

          {/* Progress Cards */}
          <ProgressCards
            currentJapa={currentJapa}
            completedMalas={completedMalas}
            beadCount={beadCount}
          />
        </ScrollView>

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          completedMalas={completedMalas}
          onClose={() => setShowSuccessModal(false)}
        />

        {/* Pro Upgrade Modal */}
        <ProUpgradeModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
        />
      </ThemedView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  content: {
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
  malaContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.spacing.xl,
    marginBottom: SIZES.spacing.lg,
    minHeight: 400,
  },
});
