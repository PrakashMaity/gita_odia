import Constants from 'expo-constants';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import bn from './bn.json';
import or from './or.json';

const resources: any = {
  bn: { translation: bn },
  or: { translation: or },
};

// Read LANGUAGE from expoConfig extra (set via app.config.js per build)
const lang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
console.log("lang",lang)
i18next.use(initReactI18next).init({
  resources,
  lng: lang,
  fallbackLng: 'bn',
  interpolation: { escapeValue: false },
});

export default i18next;
