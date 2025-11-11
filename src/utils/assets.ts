// Bengali assets only
const assets = {
  icon: require('../../assets/images/icon.png'),
  splash: require('../../assets/images/splash-icon.png'),
  adaptiveIcon: require('../../assets/images/adaptive-icon.png'),
  favicon: require('../../assets/images/favicon.png'),
  logo: require('../../assets/images/Home/logo.png'),
  header: require('../../assets/images/Home/header.png'),
  hero: require('../../assets/images/Home/hero.png'),
  headerIcons: {
    mic: require('../../assets/images/Home/icon/music.png'),
    notification: require('../../assets/images/Home/icon/nitification.png'),
  },
  buttonBackground: require('../../assets/images/Home/btnBackground.png'),
  background: require('../../assets/images/Home/background.png'),
  banner1: require('../../assets/images/onboarding/onboardBanner1.png'),
  banner2: require('../../assets/images/onboarding/onboardBanner2.png'),
  banner3: require('../../assets/images/onboarding/onboardBanner3.png'),
  dhritarystra: require('../../assets/images/speaker/dhritarystra.png'),
  sanjay: require('../../assets/images/speaker/sanjay.png'),
  arjuna: require('../../assets/images/speaker/arjuna.png'),
  shreekrishna: require('../../assets/images/speaker/shreekrishna.png'),
  duryadhona: require('../../assets/images/speaker/duryadhona.png'),
  fonts: {
    'english': require('../../assets/fonts/english.ttf'),
    'primary': require('../../assets/fonts/primary.ttf'),
    'secondary': require('../../assets/fonts/secondary.ttf'),
    'tertiary': require('../../assets/fonts/tertiary.ttf'),
    'quaternary': require('../../assets/fonts/quaternary.ttf'),
  },
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
