/**
 * Verse-specific Text-to-Speech hook
 * Handles verse playback with Language → "Orthat" → translation sequence
 */
import { getVoiceOptions } from '@/utils/speakerVoiceConfig';
import { delay, MAX_TEXT_LENGTH, splitTextIntoChunks } from '@/utils/textToSpeechUtils';
import * as Speech from 'expo-speech';
import { useRef, useState } from 'react';
import { useProStatus } from './useProStatus';

export interface VerseItem {
  text?: string; // For single text (backward compatibility)
  Language?: string; // Original language text
  translation?: string; // Translation text
  speakerEnglish?: string;
}

export interface UseVerseTextToSpeechOptions {
  onFinish?: () => void;
  onError?: (error: Error) => void;
  onVerseStart?: (verseIndex: number, totalVerses: number) => void;
  onVerseComplete?: (verseIndex: number, totalVerses: number) => void;
  onLanguageStart?: (text: string, verseIndex: number) => void;
  onLanguageComplete?: () => void;
  onTranslationStart?: (text: string, verseIndex: number) => void;
  onTranslationComplete?: () => void;
  language?: string;
  pitch?: number;
  rate?: number;
}

// const ORTHAT_TEXT = i18n.t('general.orthat'); // "Orthat" means "meaning" or "that is" - Currently not used

export const useVerseTextToSpeech = (options: UseVerseTextToSpeechOptions = {}) => {
  const { isPro } = useProStatus();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isPlayingVersesRef = useRef<boolean>(false);

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
            isPlayingVersesRef.current = false;
            options.onFinish?.();
          }
          resolve();
        },
        onStopped: () => {
          setIsSpeaking(false);
          setIsPaused(false);
          isPlayingVersesRef.current = false;
          resolve();
        },
        onError: (error) => {
          setIsSpeaking(false);
          setIsPaused(false);
          isPlayingVersesRef.current = false;
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
      const chunks = splitTextIntoChunks(text, MAX_TEXT_LENGTH);
      
      for (let i = 0; i < chunks.length; i++) {
        if (!isPlayingVersesRef.current && i > 0) break;
        const isLastChunk = i === chunks.length - 1;
        await speakChunk(chunks[i], speakerEnglish, isLastChunk);
        if (!isLastChunk) {
          await delay(200);
        }
      }
    } catch (error) {
      setIsSpeaking(false);
      setIsPaused(false);
      options.onError?.(error instanceof Error ? error : new Error('Speech error'));
    }
  };

  const speakVerses = async (verses: VerseItem[]): Promise<void> => {
    // Check PRO status before allowing speech
    if (!isPro) {
      options.onError?.(new Error('PRO_REQUIRED'));
      return;
    }

    try {
      await stop();

      if (verses.length === 0) return;

      isPlayingVersesRef.current = true;
      const totalVerses = verses.length;

      for (let i = 0; i < verses.length; i++) {
        // Check if stopped during playback
        if (!isPlayingVersesRef.current) {
          break;
        }

        const verse = verses[i];
        const verseIndex = i + 1; // 1-based index for display
        
        // Notify that verse is starting
        options.onVerseStart?.(verseIndex, totalVerses);

        const isLastVerse = i === verses.length - 1;

        // Play verse parts in sequence: Language → translation
        if (verse.Language || verse.translation) {
          // Play Language first if available
          if (verse.Language) {
            // Notify that Language is starting
            options.onLanguageStart?.(verse.Language, verseIndex);
            
            const languageChunks = splitTextIntoChunks(verse.Language, MAX_TEXT_LENGTH);
            for (let j = 0; j < languageChunks.length; j++) {
              if (!isPlayingVersesRef.current) break;
              const isLastLanguageChunk = j === languageChunks.length - 1 && !verse.translation;
              await speakChunk(languageChunks[j], verse.speakerEnglish, isLastLanguageChunk && isLastVerse);
              if (!isLastLanguageChunk || verse.translation) {
                await delay(200);
              }
            }
            
            // Notify that Language is complete
            options.onLanguageComplete?.();
          }

          // Play translation if available
          if (verse.translation) {
            // Notify that translation is starting
            options.onTranslationStart?.(verse.translation, verseIndex);
            
            const translationChunks = splitTextIntoChunks(verse.translation, MAX_TEXT_LENGTH);
            for (let j = 0; j < translationChunks.length; j++) {
              if (!isPlayingVersesRef.current) break;
              const isLastChunk = isLastVerse && j === translationChunks.length - 1;
              await speakChunk(translationChunks[j], verse.speakerEnglish, isLastChunk);
              if (!isLastChunk) {
                await delay(200);
              }
            }
            
            // Notify that translation is complete
            options.onTranslationComplete?.();
          }
        } else if (verse.text) {
          // Backward compatibility: play single text
          const chunks = splitTextIntoChunks(verse.text, MAX_TEXT_LENGTH);
          for (let j = 0; j < chunks.length; j++) {
            if (!isPlayingVersesRef.current) break;
            const isLastChunk = isLastVerse && j === chunks.length - 1;
            await speakChunk(chunks[j], verse.speakerEnglish, isLastChunk);
            if (!isLastChunk) {
              await delay(200);
            }
          }
        }

        // Notify that verse is complete
        options.onVerseComplete?.(verseIndex, totalVerses);

        // Longer delay between verses for natural flow
        if (!isLastVerse) {
          await delay(400);
        }
      }

      isPlayingVersesRef.current = false;
    } catch (error) {
      setIsSpeaking(false);
      setIsPaused(false);
      isPlayingVersesRef.current = false;
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
      isPlayingVersesRef.current = false;
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
        isPlayingVersesRef.current = false;
      }
    } catch (error) {
      console.error('Error pausing speech:', error);
    }
  };

  const resume = async (): Promise<void> => {
    // Resume is not supported by expo-speech, would need to restart
    // This is a limitation of the underlying library
    setIsPaused(false);
  };

  return {
    speak,
    speakVerses,
    stop,
    pause,
    resume,
    isSpeaking,
    isPaused,
  };
};
