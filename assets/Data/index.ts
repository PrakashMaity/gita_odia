// ----- Multi-client data resolver -----
// Each language's data lives in its own subfolder (bn/, hi/, en/, etc.)
// The correct data is selected at build time via the APP_LANG env var.
// Metro bundler will only bundle the referenced folder's requires.

const bnChapters = [
    require('./bn/chapter1.json'),
    require('./bn/chapter2.json'),
    require('./bn/chapter3.json'),
    require('./bn/chapter4.json'),
    require('./bn/chapter5.json'),
    require('./bn/chapter6.json'),
    require('./bn/chapter7.json'),
    require('./bn/chapter8.json'),
    require('./bn/chapter9.json'),
    require('./bn/chapter10.json'),
    require('./bn/chapter11.json'),
    require('./bn/chapter12.json'),
    require('./bn/chapter13.json'),
    require('./bn/chapter14.json'),
    require('./bn/chapter15.json'),
    require('./bn/chapter16.json'),
    require('./bn/chapter17.json'),
    require('./bn/chapter18.json'),
];

// Add new language data here when available:
// const hiChapters = [
//   require('./hi/chapter1.json'),
//   ...
// ];

const chaptersByLang: Record<string, any[]> = {
    bn: bnChapters,
    // hi: hiChapters,
    // en: enChapters,
    // or: orChapters,
    // as: asChapters,
};

// Resolve the current client's language from expo extra config
import Constants from 'expo-constants';

const lang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';

// Export the correct data for the active client
export const rawChapters = chaptersByLang[lang] ?? chaptersByLang.bn;
