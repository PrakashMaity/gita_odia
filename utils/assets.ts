import Constants from 'expo-constants';
const LANG = Constants.expoConfig?.extra?.LANGUAGE || 'bn';

// Asset maps for each language
const bnAssets = {
  icon: require('../clients/bn/assets/images/icon.png'),
  splash: require('../clients/bn/assets/images/splash-icon.png'),
  adaptiveIcon: require('../clients/bn/assets/images/adaptive-icon.png'),
  favicon: require('../clients/bn/assets/images/favicon.png'),
  logo: require('../clients/bn/assets/images/Home/logo.png'),
  hero: require('../clients/bn/assets/images/Home/hero.png'),
  banner1: require('../clients/bn/assets/images/onboarding/onboardBanner1.png'),
  banner2: require('../clients/bn/assets/images/onboarding/onboardBanner2.png'),
  banner3: require('../clients/bn/assets/images/onboarding/onboardBanner3.png'),
  dhritarystra: require('../clients/bn/assets/images/speaker/dhritarystra.png'),
  sanjay: require('../clients/bn/assets/images/speaker/sanjay.png'),
  arjuna: require('../clients/bn/assets/images/speaker/arjuna.png'),
  shreekrishna: require('../clients/bn/assets/images/speaker/shreekrishna.png'),
  duryadhona: require('../clients/bn/assets/images/speaker/duryadhona.png'),
  fonts: {
    'SpaceMono-Regular': require('../clients/bn/assets/fonts/SpaceMono-Regular.ttf'),
    'BenSenHandwriting': require('../clients/bn/assets/fonts/BenSenHandwriting.ttf'),
    'MahinDhakaItalic': require('../clients/bn/assets/fonts/MahinDhakaItalic.ttf'),
    'BegumZiaRegulaCurve': require('../clients/bn/assets/fonts/BegumZiaRegulaCurve.ttf'),
    'FNMahinSameyaANSI': require('../clients/bn/assets/fonts/FNMahinSameyaANSI.ttf'),
  },
};

const orAssets = {
  icon: require('../clients/or/assets/images/icon.png'),
  splash: require('../clients/or/assets/images/splash-icon.png'),
  adaptiveIcon: require('../clients/or/assets/images/adaptive-icon.png'),
  favicon: require('../clients/or/assets/images/favicon.png'),
  logo: require('../clients/or/assets/images/Home/logo.png'),
  hero: require('../clients/or/assets/images/Home/hero.png'),
  banner1: require('../clients/or/assets/images/onboarding/onboardBanner1.png'),
  banner2: require('../clients/or/assets/images/onboarding/onboardBanner2.png'),
  banner3: require('../clients/or/assets/images/onboarding/onboardBanner3.png'),
  dhritarystra: require('../clients/or/assets/images/speaker/dhritarystra.png'),
  sanjay: require('../clients/or/assets/images/speaker/sanjay.png'),
  arjuna: require('../clients/or/assets/images/speaker/arjuna.png'),
  shreekrishna: require('../clients/or/assets/images/speaker/shreekrishna.png'),
  duryadhona: require('../clients/or/assets/images/speaker/duryadhona.png'),
  fonts: {
    'SpaceMono-Regular': require('../clients/or/assets/fonts/SpaceMono-Regular.ttf'),
    'BenSenHandwriting': require('../clients/or/assets/fonts/BenSenHandwriting.ttf'),
    'MahinDhakaItalic': require('../clients/or/assets/fonts/MahinDhakaItalic.ttf'),
    'BegumZiaRegulaCurve': require('../clients/or/assets/fonts/BegumZiaRegulaCurve.ttf'),
    'FNMahinSameyaANSI': require('../clients/or/assets/fonts/FNMahinSameyaANSI.ttf'),
  },
};

// For hi and as, use bn assets as fallback until they have their own assets
const hiAssets = bnAssets;
const asAssets = bnAssets;

// Select assets based on language
const assets = LANG === 'bn' ? bnAssets : 
               LANG === 'or' ? orAssets : 
               LANG === 'hi' ? hiAssets : 
               LANG === 'as' ? asAssets : 
               bnAssets; // fallback to bn

// Client-specific Images
export const ClientsImages = {
  icon: assets.icon,
  splash: assets.splash,
  adaptiveIcon: assets.adaptiveIcon,
  favicon: assets.favicon,
};

// Home Images
export const HomeImages = {
  logo: assets.logo,
  hero: assets.hero,
};

// Onboarding Images
export const OnboardingImages = {
  banner1: assets.banner1,
  banner2: assets.banner2,
  banner3: assets.banner3,
};

// Speaker Images
export const SpeakerImages = {
  dhritarystra: assets.dhritarystra,
  sanjay: assets.sanjay,
  arjuna: assets.arjuna,
  shreekrishna: assets.shreekrishna,
  duryadhona: assets.duryadhona,
};

// Client-specific Fonts
export const ClientFonts = assets.fonts;
