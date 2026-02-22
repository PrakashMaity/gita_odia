import { ProUpgradeModal } from '@/components/shared';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Text } from '@/components/ui/text';
import { createConfirmAlert, useCustomAlert } from '@/hooks/useCustomAlert';
import { useInterstitialAd } from '@/hooks/useInterstitialAd';
import { useProStatus } from '@/hooks/useProStatus';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import i18n from '@/lib/i18n';
import { HomeImages } from '@/lib/utils/assets';
import { getBengaliTTSLanguage } from '@/lib/utils/ttsLanguageUtils';
import { getLanguageFonts } from '@/types/font.interface';
import { Ionicons } from '@expo/vector-icons';
import { createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ImageBackground, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MalaJapaHeader } from './components';
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
  const [isFocusMode, setIsFocusMode] = useState(false);

  const soundInitialized = useRef(false);
  const { showAd } = useInterstitialAd();
  const lastAdShownJapa = useRef(0);
  const { isPro } = useProStatus();
  const fonts = getLanguageFonts();
  const insets = useSafeAreaInsets();
  const { showAlert, AlertComponent } = useCustomAlert();

  // Initialize TTS for mantra chanting
  const { speak: speakMantra, stop: stopMantra } = useTextToSpeech({
    language: getBengaliTTSLanguage(),
    rate: 1.0,
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

  const playBeadSound = useCallback(() => {
    playTone(800, 0.1, 0.3);
  }, [playTone]);

  const playCompletionSound = useCallback(() => {
    playTone(1000, 0.2, 0.5);
  }, [playTone]);

  // Handle mantra change with pro check
  const handleMantraChange = useCallback((mantra: MantraType) => {
    if (mantra === 'hareKrishna') {
      setSelectedMantra(mantra);
      return;
    }

    if (!isPro) {
      setShowProModal(true);
      return;
    }

    setSelectedMantra(mantra);
  }, [isPro]);

  // Handle Reset with confirmation alert
  const handleReset = useCallback(() => {
    showAlert(
      createConfirmAlert(
        i18n.t('malaJapa.reset'),
        i18n.t('malaJapa.resetConfirm'),
        () => {
          setCurrentBead(0);
          setCompletedMalas(0);
          lastAdShownJapa.current = 0;
        }
      )
    );
  }, [showAlert]);

  // Handle bead tap with sound, vibration, and TTS mantra
  const handleBeadTap = useCallback(async () => {
    if (currentBead < beadCount - 1) {
      const newBead = currentBead + 1;
      setCurrentBead(newBead);

      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      playBeadSound();

      try {
        const mantraText = getMantraText(selectedMantra);
        if (mantraText) {
          await stopMantra();
          await speakMantra(mantraText);
        }
      } catch (error) {
        console.error('Error chanting mantra:', error);
      }
    } else {
      const newCompletedMalas = completedMalas + 1;
      const newTotalJapa = newCompletedMalas * beadCount;

      setCompletedMalas(newCompletedMalas);
      setCurrentBead(0);

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      playCompletionSound();

      try {
        const mantraText = getMantraText(selectedMantra);
        if (mantraText) {
          await stopMantra();
          await speakMantra(mantraText);
        }
      } catch (error) {
        console.error('Error chanting mantra on completion:', error);
      }

      if (newTotalJapa >= 54 && newTotalJapa - lastAdShownJapa.current >= 54) {
        showAd();
        lastAdShownJapa.current = newTotalJapa;
      }

      setShowSuccessModal(true);
    }
  }, [currentBead, beadCount, completedMalas, selectedMantra, getMantraText, speakMantra, stopMantra, showAd, playBeadSound, playCompletionSound]);

  return (
    <ImageBackground
      source={HomeImages.background}
      style={{ flex: 1 }}
      resizeMode="cover"
      blurRadius={0.5}
    >
      {isFocusMode && <StatusBar hidden />}

      <Box className="flex-1 relative">
        {/* ─── Header (hidden in focus mode) ─── */}
        {!isFocusMode && <MalaJapaHeader />}

        {/* ─── Mantra Selector (hidden in focus mode) ─── */}
        {!isFocusMode && (
          <MantraSelector
            selectedMantra={selectedMantra}
            onMantraChange={handleMantraChange}
            isPro={isPro}
          />
        )}

        {isFocusMode ? (
          /* ─── Focus Mode: Centered immersive view ─── */
          <Box className="flex-1 items-center justify-center">
            {/* Exit Focus Mode Button — top-right corner */}
            <Pressable
              onPress={() => setIsFocusMode(false)}
              className="absolute right-5 bg-white/70 rounded-full w-10 h-10 items-center justify-center border border-amber-200/50 active:opacity-70 z-20"
              style={{ top: insets.top + 8 }}
            >
              <Ionicons name="close" size={22} color="#3E2723" />
            </Pressable>

            <MalaBeads
              beadCount={beadCount}
              currentBead={currentBead}
              onBeadTap={handleBeadTap}
              selectedMantra={selectedMantra}
            />

            {/* Minimal count in focus mode */}
            <Text
              className="text-[#3E2723] text-[28px] font-black mt-6 tracking-tight"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {currentBead} / {beadCount}
            </Text>
            <Text
              className="text-[#8D6E63] text-[13px] font-semibold mt-1"
              style={{ fontFamily: fonts.regional_secondary }}
            >
              {completedMalas} {i18n.t('malaJapa.completedMalas')}
            </Text>
          </Box>
        ) : (
          /* ─── Normal Mode ─── */
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40, alignItems: 'center' }}
            style={{ flex: 1 }}
          >
            {/* ─── Mala Beads ─── */}
            <Box className="w-full items-center justify-center mt-4 mb-2" style={{ minHeight: 400 }}>
              <MalaBeads
                beadCount={beadCount}
                currentBead={currentBead}
                onBeadTap={handleBeadTap}
                selectedMantra={selectedMantra}
              />
            </Box>

            {/* ─── Progress Cards ─── */}
            <ProgressCards
              currentJapa={currentJapa}
              completedMalas={completedMalas}
              beadCount={beadCount}
            />

            {/* ─── Action Buttons: Reset + Focus Mode ─── */}
            <HStack className="w-full px-4 gap-3 mt-4">
              {/* Reset */}
              <Pressable
                onPress={handleReset}
                className="flex-1 active:opacity-70"
              >
                <Box className="flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200/60 bg-white/80">
                  <Ionicons name="refresh" size={18} color="#DC2626" />
                  <Text
                    className="text-red-600 text-[14px] font-bold"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('malaJapa.reset')}
                  </Text>
                </Box>
              </Pressable>

              {/* Focus Mode */}
              <Pressable
                onPress={() => setIsFocusMode(true)}
                className="flex-1 active:opacity-70"
              >
                <Box className="flex-row items-center justify-center gap-2 py-3.5 rounded-2xl border border-amber-200/60 bg-white/80">
                  <Ionicons name="eye-outline" size={18} color="#B45309" />
                  <Text
                    className="text-amber-700 text-[14px] font-bold"
                    style={{ fontFamily: fonts.regional_secondary }}
                  >
                    {i18n.t('malaJapa.focusMode')}
                  </Text>
                </Box>
              </Pressable>
            </HStack>
          </ScrollView>
        )}

        {/* ─── Modals ─── */}
        <SuccessModal
          visible={showSuccessModal}
          completedMalas={completedMalas}
          onClose={() => setShowSuccessModal(false)}
        />

        <ProUpgradeModal
          visible={showProModal}
          onClose={() => setShowProModal(false)}
        />

        {/* ─── Custom Alert ─── */}
        {AlertComponent}
      </Box>
    </ImageBackground>
  );
};
