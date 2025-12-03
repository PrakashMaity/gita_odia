/**
 * Speaker voice configuration
 * Maps speakers to their voice characteristics
 */

export interface SpeakerVoiceConfig {
  language?: string;
  pitch?: number;
  rate?: number;
}

export interface SpeakerVoiceMap {
  [key: string]: SpeakerVoiceConfig;
}

// Map speakers to voice characteristics
// Note: Voice selection depends on available system voices
export const SPEAKER_VOICE_MAP: SpeakerVoiceMap = {
  'Shree Krishna': {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.9, // Slightly slower for divine speech
  },
  'Krishna': {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.9,
  },
  'Parameshwar': {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.9,
  },
  'Shree Bhagwan': {
    language: 'en-US',
    pitch: 1.0,
    rate: 0.9,
  },
  'Arjuna': {
    language: 'en-US',
    pitch: 0.95,
    rate: 0.95,
  },
  'Dhritarashtra': {
    language: 'en-US',
    pitch: 0.85, // Lower pitch for older character
    rate: 0.85, // Slower for older character
  },
  'Sanjay': {
    language: 'en-US',
    pitch: 0.9,
    rate: 0.95,
  },
  'Duryodhana': {
    language: 'en-US',
    pitch: 0.9,
    rate: 0.95,
  },
};

/**
 * Get voice options for a speaker
 * @param speakerEnglish - English name of the speaker
 * @param defaultLanguage - Default language to use
 * @param defaultPitch - Default pitch
 * @param defaultRate - Default rate
 * @returns Voice options object
 */
export const getVoiceOptions = (
  speakerEnglish?: string,
  defaultLanguage: string = 'en-US',
  defaultPitch: number = 1.0,
  defaultRate: number = 0.9
): { language: string; pitch: number; rate: number } => {
  const defaultOptions = {
    language: defaultLanguage,
    pitch: defaultPitch,
    rate: defaultRate,
  };

  if (speakerEnglish) {
    const speakerConfig = SPEAKER_VOICE_MAP[speakerEnglish];
    if (speakerConfig) {
      return {
        language: speakerConfig.language || defaultOptions.language,
        pitch: speakerConfig.pitch || defaultOptions.pitch,
        rate: speakerConfig.rate || defaultOptions.rate,
      };
    }
  }

  return defaultOptions;
};

