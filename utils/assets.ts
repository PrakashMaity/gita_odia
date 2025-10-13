import Constants from 'expo-constants';

const LANG = Constants.expoConfig?.extra?.LANGUAGE || 'bn';

export const ClientsImages = {
  icon: require(`../clients/${LANG}/assets/images/icon.png`),
  splash: require(`../clients/${LANG}/assets/images/splash-icon.png`),
  adaptiveIcon: require(`../clients/${LANG}/assets/images/adaptive-icon.png`),
};
