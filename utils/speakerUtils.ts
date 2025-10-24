import { SpeakerImages } from './assets';

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
