// ----- Multi-Client Configuration -----
// Central registry of per-client app metadata.
// The active client is determined by the LANGUAGE key in expo extra config,
// which is set from the APP_LANG env var via app.config.js → dotenv.

import Constants from 'expo-constants';

export interface ClientConfig {
    lang: string;
    appName: string;
    fontFamily: string;
    scriptDirection: 'ltr' | 'rtl';
}

const CLIENTS: Record<string, ClientConfig> = {
    bn: {
        lang: 'bn',
        appName: 'গীতা বাংলা',
        fontFamily: 'NotoSerifBengali',
        scriptDirection: 'ltr',
    },
    hi: {
        lang: 'hi',
        appName: 'गीता हिंदी',
        fontFamily: 'NotoSerifDevanagari',
        scriptDirection: 'ltr',
    },
    en: {
        lang: 'en',
        appName: 'Bhagavad Gita',
        fontFamily: 'NotoSerif',
        scriptDirection: 'ltr',
    },
    or: {
        lang: 'or',
        appName: 'ଗୀତା ଓଡ଼ିଆ',
        fontFamily: 'NotoSerifOriya',
        scriptDirection: 'ltr',
    },
    as: {
        lang: 'as',
        appName: 'গীতা অসমীয়া',
        fontFamily: 'NotoSerifBengali', // Assamese uses Bengali script
        scriptDirection: 'ltr',
    },
    gu: {
        lang: 'gu',
        appName: 'ગીતા ગુજરાતી',
        fontFamily: 'NotoSerifGujarati',
        scriptDirection: 'ltr',
    },
    ne: {
        lang: 'ne',
        appName: 'गीता नेपाली',
        fontFamily: 'NotoSerifDevanagari', // Nepali uses Devanagari script
        scriptDirection: 'ltr',
    },
    ta: {
        lang: 'ta',
        appName: 'gitatamil',
        fontFamily: 'NotoSerifTamil',
        scriptDirection: 'ltr',
    },
};

/**
 * Returns the configuration for the currently active client.
 * Falls back to Bengali if the language is unknown.
 */
export const getClientConfig = (): ClientConfig => {
    const lang =
        Constants.expoConfig?.extra?.LANGUAGE || 'bn';
    return CLIENTS[lang] ?? CLIENTS.bn;
};

/**
 * Returns the current language code (e.g., 'bn', 'hi', 'en').
 */
export const getActiveLang = (): string => {
    return Constants.expoConfig?.extra?.LANGUAGE || 'bn';
};

export default CLIENTS;
