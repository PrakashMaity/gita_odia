import Constants from 'expo-constants';
import { I18n } from 'i18n-js';

// Per-language UI translations
// Add new language imports here when available:
import bn from './translations/bn.json';
// import hi from './translations/hi.json';
// import en from './translations/en.json';

const translations: Record<string, any> = {
    bn,
    // hi,
    // en,
};

const lang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';

const i18n = new I18n(translations);

// Set the locale to the active client's language
i18n.locale = lang;

// When a value is missing from a language it'll fall back to Bengali
i18n.enableFallback = true;
i18n.defaultLocale = 'bn';

export default i18n;
