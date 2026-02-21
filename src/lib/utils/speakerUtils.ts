import { SpeakerImages } from './assets';
import { convertFromLocalizedNumber } from './numberConverter';

/**
 * Maps English speaker names to their corresponding speaker images
 * @param speakerEnglish - The English name of the speaker
 * @returns The corresponding speaker image or default Krishna image
 */
export const getSpeakerImage = (speakerEnglish: string) => {
  // Map English speaker names to images
  const speakerImages: { [key: string]: any } = {
    'Dhritarashtra': SpeakerImages.dhritarystra,
    'Sanjay': SpeakerImages.sanjay,
    'Arjuna': SpeakerImages.arjuna,
    'Duryodhana': SpeakerImages.duryadhona,
    'Shree Krishna': SpeakerImages.shreekrishna,
    'Krishna': SpeakerImages.shreekrishna,
    'Parameshwar': SpeakerImages.shreekrishna,
    'Shree Bhagwan': SpeakerImages.shreekrishna,
  };
  
  return speakerImages[speakerEnglish] || SpeakerImages.shreekrishna;
};

/**
 * Gets the speaker avatar based on chapter number (supports any language)
 * @param chapterNumber - The chapter number in any localized format (e.g., '১', '१', '୧', '1')
 * @returns The corresponding speaker image
 */
export const getSpeakerAvatar = (chapterNumber: string) => {
  // Convert localized number to integer
  const chapterInt = parseInt(convertFromLocalizedNumber(chapterNumber), 10);
  
  // Chapter 1 is Dhritarashtra, all others are Krishna
  if (chapterInt === 1) {
    return SpeakerImages.dhritarystra;
  }
  
  // Default to Krishna for all other chapters
  return SpeakerImages.shreekrishna;
};
