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

const hiChapters = [
    require('./hi/chapter1.json'),
    require('./hi/chapter2.json'),
    require('./hi/chapter3.json'),
    require('./hi/chapter4.json'),
    require('./hi/chapter5.json'),
    require('./hi/chapter6.json'),
    require('./hi/chapter7.json'),
    require('./hi/chapter8.json'),
    require('./hi/chapter9.json'),
    require('./hi/chapter10.json'),
    require('./hi/chapter11.json'),
    require('./hi/chapter12.json'),
    require('./hi/chapter13.json'),
    require('./hi/chapter14.json'),
    require('./hi/chapter15.json'),
    require('./hi/chapter16.json'),
    require('./hi/chapter17.json'),
    require('./hi/chapter18.json'),
];

const enChapters = [
    require('./en/chapter1.json'),
    require('./en/chapter2.json'),
    require('./en/chapter3.json'),
    require('./en/chapter4.json'),
    require('./en/chapter5.json'),
    require('./en/chapter6.json'),
    require('./en/chapter7.json'),
    require('./en/chapter8.json'),
    require('./en/chapter9.json'),
    require('./en/chapter10.json'),
    require('./en/chapter11.json'),
    require('./en/chapter12.json'),
    require('./en/chapter13.json'),
    require('./en/chapter14.json'),
    require('./en/chapter15.json'),
    require('./en/chapter16.json'),
    require('./en/chapter17.json'),
    require('./en/chapter18.json'),
];

const orChapters = [
    require('./or/chapter1.json'),
    require('./or/chapter2.json'),
    require('./or/chapter3.json'),
    require('./or/chapter4.json'),
    require('./or/chapter5.json'),
    require('./or/chapter6.json'),
    require('./or/chapter7.json'),
    require('./or/chapter8.json'),
    require('./or/chapter9.json'),
    require('./or/chapter10.json'),
    require('./or/chapter11.json'),
    require('./or/chapter12.json'),
    require('./or/chapter13.json'),
    require('./or/chapter14.json'),
    require('./or/chapter15.json'),
    require('./or/chapter16.json'),
    require('./or/chapter17.json'),
    require('./or/chapter18.json'),
];

const asChapters = [
    require('./as/chapter1.json'),
    require('./as/chapter2.json'),
    require('./as/chapter3.json'),
    require('./as/chapter4.json'),
    require('./as/chapter5.json'),
    require('./as/chapter6.json'),
    require('./as/chapter7.json'),
    require('./as/chapter8.json'),
    require('./as/chapter9.json'),
    require('./as/chapter10.json'),
    require('./as/chapter11.json'),
    require('./as/chapter12.json'),
    require('./as/chapter13.json'),
    require('./as/chapter14.json'),
    require('./as/chapter15.json'),
    require('./as/chapter16.json'),
    require('./as/chapter17.json'),
    require('./as/chapter18.json'),
];

const guChapters = [
    require('./gu/chapter1.json'),
    require('./gu/chapter2.json'),
    require('./gu/chapter3.json'),
    require('./gu/chapter4.json'),
    require('./gu/chapter5.json'),
    require('./gu/chapter6.json'),
    require('./gu/chapter7.json'),
    require('./gu/chapter8.json'),
    require('./gu/chapter9.json'),
    require('./gu/chapter10.json'),
    require('./gu/chapter11.json'),
    require('./gu/chapter12.json'),
    require('./gu/chapter13.json'),
    require('./gu/chapter14.json'),
    require('./gu/chapter15.json'),
    require('./gu/chapter16.json'),
    require('./gu/chapter17.json'),
    require('./gu/chapter18.json'),
];

const neChapters = [
    require('./ne/chapter1.json'),
    require('./ne/chapter2.json'),
    require('./ne/chapter3.json'),
    require('./ne/chapter4.json'),
    require('./ne/chapter5.json'),
    require('./ne/chapter6.json'),
    require('./ne/chapter7.json'),
    require('./ne/chapter8.json'),
    require('./ne/chapter9.json'),
    require('./ne/chapter10.json'),
    require('./ne/chapter11.json'),
    require('./ne/chapter12.json'),
    require('./ne/chapter13.json'),
    require('./ne/chapter14.json'),
    require('./ne/chapter15.json'),
    require('./ne/chapter16.json'),
    require('./ne/chapter17.json'),
    require('./ne/chapter18.json'),
];


const taChapters = [
    require('./ta/chapter1.json'),
    require('./ta/chapter2.json'),
    require('./ta/chapter3.json'),
    require('./ta/chapter4.json'),
    require('./ta/chapter5.json'),
    require('./ta/chapter6.json'),
    require('./ta/chapter7.json'),
    require('./ta/chapter8.json'),
    require('./ta/chapter9.json'),
    require('./ta/chapter10.json'),
    require('./ta/chapter11.json'),
    require('./ta/chapter12.json'),
    require('./ta/chapter13.json'),
    require('./ta/chapter14.json'),
    require('./ta/chapter15.json'),
    require('./ta/chapter16.json'),
    require('./ta/chapter17.json'),
    require('./ta/chapter18.json'),
];

const paChapters = [
    require('./pa/chapter1.json'),
    require('./pa/chapter2.json'),
    require('./pa/chapter3.json'),
    require('./pa/chapter4.json'),
    require('./pa/chapter5.json'),
    require('./pa/chapter6.json'),
    require('./pa/chapter7.json'),
    require('./pa/chapter8.json'),
    require('./pa/chapter9.json'),
    require('./pa/chapter10.json'),
    require('./pa/chapter11.json'),
    require('./pa/chapter12.json'),
    require('./pa/chapter13.json'),
    require('./pa/chapter14.json'),
    require('./pa/chapter15.json'),
    require('./pa/chapter16.json'),
    require('./pa/chapter17.json'),
    require('./pa/chapter18.json'),
];
const chaptersByLang: Record<string, any[]> = {
    bn: bnChapters,
    hi: hiChapters,
    en: enChapters,
    or: orChapters,
    as: asChapters,
    gu: guChapters,
    ne: neChapters,
    ta: taChapters,
    pa: paChapters,
};

// Resolve the current client's language from expo extra config
import Constants from 'expo-constants';

const lang = Constants.expoConfig?.extra?.LANGUAGE || 'bn';

// Export the correct data for the active client
export const rawChapters = chaptersByLang[lang] ?? chaptersByLang.bn;
