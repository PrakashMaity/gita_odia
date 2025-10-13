import Constants from 'expo-constants';
import { I18n } from 'i18n-js';

import bn from './bn.json';
import or from './or.json';

const translations = {
    bn: bn,
    or: or,
  };
  const i18n = new I18n(translations);
  
  // Set the locale once at the beginning of your app.
  i18n.locale = Constants.expoConfig?.extra?.LANGUAGE || 'bn';
  
  // When a value is missing from a language it'll fall back to another language with the key present.
  i18n.enableFallback = true;
  // To see the fallback mechanism uncomment the line below to force the app to use the Japanese language.
  // i18n.locale = 'ja';

export default i18n;
