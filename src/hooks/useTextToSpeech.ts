/**
 * Reusable Text-to-Speech hook
 * Provides basic TTS functionality without domain-specific logic
 */
import { getVoiceOptions } from '@/lib/utils/speakerVoiceConfig';
import { delay, MAX_TEXT_LENGTH, splitTextIntoChunks } from '@/lib/utils/textToSpeechUtils';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { useProStatus } from './useProStatus';

export interface UseTextToSpeechOptions {
  onFinish?: () => void;
  onError?: (error: Error) => void;
  language?: string;
  pitch?: number;
  rate?: number;
}

export const useTextToSpeech = (options: UseTextToSpeechOptions = {}) => {
  const { isPro } = useProStatus();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const currentTextRef = useRef<string>('');
  const currentSpeakerRef = useRef<string>('');
  const textChunksRef = useRef<string[]>([]);
  const isPlayingChunksRef = useRef<boolean>(false);

  const speakChunk = async (
    chunk: string,
    speakerEnglish?: string,
    isLastChunk: boolean = false
  ): Promise<void> => {
    const voiceOptions = getVoiceOptions(
      speakerEnglish,
      options.language || 'en-US',
      options.pitch || 1.0,
      options.rate || 0.9
    );

    return new Promise<void>((resolve, reject) => {
      Speech.speak(chunk, {
        ...voiceOptions,
        onStart: () => {
          setIsSpeaking(true);
          setIsPaused(false);
        },
        onDone: () => {
          if (isLastChunk) {
            setIsSpeaking(false);
            setIsPaused(false);
            currentTextRef.current = '';
            currentSpeakerRef.current = '';
            textChunksRef.current = [];
            isPlayingChunksRef.current = false;
            options.onFinish?.();
          }
          resolve();
        },
        onStopped: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          currentTextRef.current = '';
          currentSpeakerRef.current = '';
          textChunksRef.current = [];
          isPlayingChunksRef.current = false;
          resolve();
        },
        onError: (error) => {
          setIsSpeaking(false);
          setIsPaused(false);
          textChunksRef.current = [];
          isPlayingChunksRef.current = false;
          options.onError?.(error);
          reject(error);
        },
      });
    });
  };

  const speak = async (text: string, speakerEnglish?: string): Promise<void> => {
    // Check PRO status before allowing speech
    if (!isPro) {
      options.onError?.(new Error('PRO_REQUIRED'));
      return;
    }

    try {
      await stop();

      currentTextRef.current = text;
      currentSpeakerRef.current = speakerEnglish || '';

      // Split text into chunks if too long
      const chunks = splitTextIntoChunks(text, MAX_TEXT_LENGTH);
      textChunksRef.current = chunks;
      isPlayingChunksRef.current = chunks.length > 1;

      if (chunks.length === 1) {
        // Single chunk, play directly
        await speakChunk(chunks[0], speakerEnglish, true);
      } else {
        // Multiple chunks, play sequentially
        for (let i = 0; i < chunks.length; i++) {
          // Check if stopped during playback
          if (!isPlayingChunksRef.current && i > 0) {
            break;
          }
          
          const isLastChunk = i === chunks.length - 1;
          await speakChunk(chunks[i], speakerEnglish, isLastChunk);
          
          // Small delay between chunks for natural flow
          if (!isLastChunk) {
            await delay(200);
          }
        }
      }
    } catch (error) {
      setIsSpeaking(false);
      setIsPaused(false);
      textChunksRef.current = [];
      isPlayingChunksRef.current = false;
      options.onError?.(error instanceof Error ? error : new Error('Speech error'));
    }
  };

  const stop = async (): Promise<void> => {
    try {
      const isCurrentlySpeaking = await Speech.isSpeakingAsync();
      if (isCurrentlySpeaking) {
        Speech.stop();
      }
      setIsSpeaking(false);
      setIsPaused(false);
      currentTextRef.current = '';
      currentSpeakerRef.current = '';
      textChunksRef.current = [];
      isPlayingChunksRef.current = false;
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  };

  const pause = async (): Promise<void> => {
    try {
      const isCurrentlySpeaking = await Speech.isSpeakingAsync();
      if (isCurrentlySpeaking) {
        Speech.stop();
        setIsPaused(true);
        isPlayingChunksRef.current = false;
      }
    } catch (error) {
      console.error('Error pausing speech:', error);
    }
  };

  const resume = async (): Promise<void> => {
    if (isPaused && currentTextRef.current) {
      // Resume from the beginning (expo-speech doesn't support resume from pause point)
      await speak(currentTextRef.current, currentSpeakerRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stop();
    };
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
  };
};
