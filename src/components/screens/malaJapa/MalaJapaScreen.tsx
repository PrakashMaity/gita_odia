import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
} from 'react-native';
import { ThemedView } from '@/components/ui/ThemedView/ThemedView';
import { ThemedLanguageText } from '@/components/ui/ThemedLanguageText';
import { PageHeader } from '@/components/shared';
import { SIZES } from '@/rootconstants/sizes';
import i18n from '@/i18n';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import { MalaBeads } from './components/MalaBeads';
import { MantraSelector } from './components/MantraSelector';
import { ProgressCards } from './components/ProgressCards';
import { SuccessModal } from './components/SuccessModal';

type MantraType = 'hareKrishna' | 'omNamah' | 'gitaDhyana' | 'custom';
type BeadCount = 27 | 54 | 108;

export const MalaJapaScreen: React.FC = () => {
  const { width, height } = Dimensions.get('window');
  const [currentBead, setCurrentBead] = useState(0);
  const [beadCount, setBeadCount] = useState<BeadCount>(108);
  const [selectedMantra, setSelectedMantra] = useState<MantraType>('hareKrishna');
  const [completedMalas, setCompletedMalas] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  const soundInitialized = useRef(false);

  // Initialize audio
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        soundInitialized.current = true;
      } catch (error) {
        console.log('Audio setup error:', error);
      }
    };

    setupAudio();
  }, []);

  // Calculate current japa count
  const currentJapa = currentBead + completedMalas * beadCount;

  // Play bead sound - simple beep
  const playBeadSound = async () => {
    if (!soundInitialized.current) return;
    
    try {
      // Create a simple beep using Audio API
      // Generate a brief tone (800Hz for 100ms)
      const sampleRate = 44100;
      const duration = 0.1;
      const frequency = 800;
      const numSamples = Math.floor(sampleRate * duration);
      
      // Create WAV file data
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);
      
      // WAV header
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
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
      
      // Generate sine wave
      for (let i = 0; i < numSamples; i++) {
        const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.3;
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, intSample * 0x7FFF, true);
      }
      
      // Convert to base64
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/wav;base64,${base64}` },
        { shouldPlay: true, volume: 0.3 }
      );
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (error) {
      // Silently fail - vibration will still work
    }
  };

  // Play completion sound
  const playCompletionSound = async () => {
    if (!soundInitialized.current) return;
    
    try {
      const sampleRate = 44100;
      const duration = 0.2;
      const frequency = 1000; // Higher pitch
      const numSamples = Math.floor(sampleRate * duration);
      
      const buffer = new ArrayBuffer(44 + numSamples * 2);
      const view = new DataView(buffer);
      
      const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
          view.setUint8(offset + i, string.charCodeAt(i));
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
        const sample = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.4;
        const intSample = Math.max(-1, Math.min(1, sample));
        view.setInt16(44 + i * 2, intSample * 0x7FFF, true);
      }
      
      const bytes = new Uint8Array(buffer);
      let binary = '';
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      const base64 = btoa(binary);
      
      const { sound } = await Audio.Sound.createAsync(
        { uri: `data:audio/wav;base64,${base64}` },
        { shouldPlay: true, volume: 0.5 }
      );
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch (error) {
      // Silently fail
    }
  };

  // Handle bead tap with sound and vibration
  const handleBeadTap = useCallback(async () => {
    if (currentBead < beadCount - 1) {
      const newBead = currentBead + 1;
      setCurrentBead(newBead);
      
      // Vibration - always works
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // Sound
      playBeadSound().catch(() => {
        // Silently continue if sound fails
      });
    } else {
      // Complete one mala
      const newCompletedMalas = completedMalas + 1;
      setCompletedMalas(newCompletedMalas);
      setCurrentBead(0);
      
      // Stronger vibration for completion
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Completion sound
      playCompletionSound().catch(() => {
        // Silently continue
      });
      
      // Show success modal
      setShowSuccessModal(true);
    }
  }, [currentBead, beadCount, completedMalas]);

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
          showBackButton={true}
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

          {/* Mantra Selector Button */}
          <MantraSelector
            selectedMantra={selectedMantra}
            onMantraChange={setSelectedMantra}
          />

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
