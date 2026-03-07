import Constants from 'expo-constants';
import { I18n } from 'i18n-js';

// Per-language UI translations
import as_ from './translations/as.json'; // 'as' is a reserved keyword
import bn from './translations/bn.json';
import en from './translations/en.json';
import gu from './translations/gu.json';
import hi from './translations/hi.json';
import ne from './translations/ne.json';
import or from './translations/or.json';
import ta from './translations/ta.json';
import pa from './translations/pa.json';

const translations: Record<string, any> = {
    bn,
    hi,
    en,
    or,
    as: as_,
    gu,
    ne,
    ta,
    pa,
};

const lang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';

const i18n = new I18n(translations);

// Set the locale to the active client's language
i18n.locale = lang;

// When a value is missing from a language it'll fall back to Bengali
i18n.enableFallback = true;
i18n.defaultLocale = 'bn';

export default i18n;
