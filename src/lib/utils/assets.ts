import { getActiveLang } from '@/config/clientConfig';

// ----- Per-language font map -----
// Each language folder under assets/fonts/{lang}/ has: primary.ttf, secondary.ttf, english.ttf
// Font names registered with expo-font remain 'primary', 'secondary', 'english'
// so all consuming components (50+ files) need zero changes.
type FontMap = Record<string, number>; // number = require() return type in RN

const LANGUAGE_FONTS: Record<string, FontMap> = {
  bn: {
    english: require('../../../assets/fonts/bn/english.ttf'),
    primary: require('../../../assets/fonts/bn/primary.ttf'),
    secondary: require('../../../assets/fonts/bn/secondary.ttf'),
  },
  hi: {
    english: require('../../../assets/fonts/hi/english.ttf'),
    primary: require('../../../assets/fonts/hi/primary.ttf'),
    secondary: require('../../../assets/fonts/hi/secondary.ttf'),
  },
  en: {
    english: require('../../../assets/fonts/en/english.ttf'),
    primary: require('../../../assets/fonts/en/primary.ttf'),
    secondary: require('../../../assets/fonts/en/secondary.ttf'),
  },
  or: {
    english: require('../../../assets/fonts/or/english.ttf'),
    primary: require('../../../assets/fonts/or/primary.ttf'),
    secondary: require('../../../assets/fonts/or/secondary.ttf'),
  },
  as: {
    english: require('../../../assets/fonts/as/english.ttf'),
    primary: require('../../../assets/fonts/as/primary.ttf'),
    secondary: require('../../../assets/fonts/as/secondary.ttf'),
  },
  gu: {
    english: require('../../../assets/fonts/gu/english.ttf'),
    primary: require('../../../assets/fonts/gu/primary.ttf'),
    secondary: require('../../../assets/fonts/gu/secondary.ttf'),
  },
  ne: {
    english: require('../../../assets/fonts/ne/english.ttf'),
    primary: require('../../../assets/fonts/ne/primary.ttf'),
    secondary: require('../../../assets/fonts/ne/secondary.ttf'),
  },
};

/**
 * Returns the font map for the active client language.
 * Falls back to Bengali if the language is unknown.
 */
const getFontsForLanguage = (): FontMap => {
  const lang = getActiveLang();
  return LANGUAGE_FONTS[lang] ?? LANGUAGE_FONTS.bn;
};

// ----- Per-language branding images -----
type BrandingImages = {
  icon: any;
  splash: any;
  adaptiveIcon: any;
  favicon: any;
  logo: any;
};

const LANGUAGE_IMAGES: Record<string, BrandingImages> = {
  bn: {
    icon: require('../../../assets/images/bn/icon.png'),
    splash: require('../../../assets/images/bn/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/bn/adaptive-icon.png'),
    favicon: require('../../../assets/images/bn/favicon.png'),
    logo: require('../../../assets/images/bn/logo.png'),
  },
  hi: {
    icon: require('../../../assets/images/hi/icon.png'),
    splash: require('../../../assets/images/hi/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/hi/adaptive-icon.png'),
    favicon: require('../../../assets/images/hi/favicon.png'),
    logo: require('../../../assets/images/hi/logo.png'),
  },
  en: {
    icon: require('../../../assets/images/en/icon.png'),
    splash: require('../../../assets/images/en/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/en/adaptive-icon.png'),
    favicon: require('../../../assets/images/en/favicon.png'),
    logo: require('../../../assets/images/en/logo.png'),
  },
  or: {
    icon: require('../../../assets/images/or/icon.png'),
    splash: require('../../../assets/images/or/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/or/adaptive-icon.png'),
    favicon: require('../../../assets/images/or/favicon.png'),
    logo: require('../../../assets/images/or/logo.png'),
  },
  as: {
    icon: require('../../../assets/images/as/icon.png'),
    splash: require('../../../assets/images/as/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/as/adaptive-icon.png'),
    favicon: require('../../../assets/images/as/favicon.png'),
    logo: require('../../../assets/images/as/logo.png'),
  },
  gu: {
    icon: require('../../../assets/images/gu/icon.png'),
    splash: require('../../../assets/images/gu/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/gu/adaptive-icon.png'),
    favicon: require('../../../assets/images/gu/favicon.png'),
    logo: require('../../../assets/images/gu/logo.png'),
  },
  ne: {
    icon: require('../../../assets/images/ne/icon.png'),
    splash: require('../../../assets/images/ne/splash-icon.png'),
    adaptiveIcon: require('../../../assets/images/ne/adaptive-icon.png'),
    favicon: require('../../../assets/images/ne/favicon.png'),
    logo: require('../../../assets/images/ne/logo.png'),
  },
};

const getBrandingImages = () => {
  const lang = getActiveLang();
  return LANGUAGE_IMAGES[lang] ?? LANGUAGE_IMAGES.bn;
};

const assets = {
  ...getBrandingImages(),
  header: require('../../../assets/images/Home/header.png'),
  hero: require('../../../assets/images/Home/hero.png'),
  headerIcons: {
    mic: require('../../../assets/images/Home/icon/music.png'),
    notification: require('../../../assets/images/Home/icon/nitification.png'),
  },
  buttonBackground: require('../../../assets/images/Home/btnBackground.png'),
  background: require('../../../assets/images/Home/background.png'),
  banner1: require('../../../assets/images/onboarding/onboardBanner1.png'),
  banner2: require('../../../assets/images/onboarding/onboardBanner2.png'),
  banner3: require('../../../assets/images/onboarding/onboardBanner3.png'),
  dhritarystra: require('../../../assets/images/speaker/dhritarystra.png'),
  sanjay: require('../../../assets/images/speaker/sanjay.png'),
  arjuna: require('../../../assets/images/speaker/arjuna.png'),
  shreekrishna: require('../../../assets/images/speaker/shreekrishna.png'),
  duryadhona: require('../../../assets/images/speaker/duryadhona.png'),
  fonts: getFontsForLanguage(),
  layoutBackground1: require('../../../assets/images/layoutBackground1.png'),
  layoutBackground2: require('../../../assets/images/layoutBackground2.png'),
  layoutBackground3: require('../../../assets/images/layoutBackground3.png'),
  chapters: [
    require('../../../assets/images/chapter/c1.jpeg'),
    require('../../../assets/images/chapter/c2.jpeg'),
    require('../../../assets/images/chapter/c3.jpeg'),
    require('../../../assets/images/chapter/c4.jpeg'),
    require('../../../assets/images/chapter/c5.jpeg'),
    require('../../../assets/images/chapter/c6.jpeg'),
    require('../../../assets/images/chapter/c7.jpeg'),
  ],
};

// Home Images
export const HomeImages = {
  logo: assets.logo,
  hero: assets.hero,
  header: assets.header,
  headerIcons: assets.headerIcons,
  background: assets.background,
  buttonBackground: assets.buttonBackground,
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

// Client-specific Fonts (used in app/_layout.tsx)
export const ClientFonts = assets.fonts;

export const LayoutImages = {
  background1: assets.layoutBackground1,
  background2: assets.layoutBackground2,
  background3: assets.layoutBackground3,
};

export const ChapterImages = assets.chapters;
