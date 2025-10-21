import Constants from 'expo-constants';

export const FONTS_ENGLISH = {
  en_primary: 'SpaceMono-Regular',
};

// Bengali fonts
export const FONTS_BENGALI = {
  primary_english: 'SpaceMono-Regular',
  regional_primary: 'BegumZiaRegulaCurve',
  regional_secondary: 'MahinDhakaItalic',
  regional_tertiary: 'FNMahinSameyaANSI',
  regional_quaternary: 'BenSenHandwriting',
};

// Odia fonts
export const FONTS_ODIA = {
  primary_english: 'SpaceMono-Regular',
  regional_primary: 'NotoSansOriya',
  regional_secondary: 'NotoSerifOriya2',
  regional_tertiary: 'AnekOdia',
  regional_quaternary: 'BalooBhaina2',
};

// Hindi fonts (using Bengali fonts as fallback for now)
export const FONTS_HINDI = FONTS_BENGALI;

// Assamese fonts (using Bengali fonts as fallback for now)
export const FONTS_ASSAMESE = FONTS_BENGALI;

// Function to get language-specific fonts
export const getLanguageFonts = () => {
  const LANG = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  
  switch (LANG) {
    case 'en':
      return FONTS_ENGLISH;
    case 'or':
      return FONTS_ODIA;
    case 'hi':
      return FONTS_HINDI;
    case 'as':
      return FONTS_ASSAMESE;
    case 'bn':
    default:
      return FONTS_BENGALI;
  }
};

// Default to Bengali for backward compatibility
export const FONTS_LANGUAGE = getLanguageFonts();