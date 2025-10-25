// Load environment variables
import { config } from 'dotenv';

// Load environment variables based on APP_LANG
const lang = process.env.APP_LANG || 'bn';
config({ path: `.env.${lang}` });



// Language-specific configuration
const languageConfigs = {
  bn: {
    name: "গীতা বাংলা",
    slug: "bhagavad_gita",
    iosBundleIdentifier: "com.proninja.bhagavad-gita",
    androidPackage: "com.proninja.bhagavad_gita",
    primaryColor: "#ffffff",
    languageCode: "bn",
    icon: "./clients/bn/assets/images/icon.png",
    splash: "./clients/bn/assets/images/splash-icon.png",
    adaptiveIcon: "./clients/bn/assets/images/adaptive-icon.png",
    projectId: "4276c4fa-4062-4c56-9fb4-26fabacd8a23",
    androidAppId: "ca-app-pub-3940256099942544~3347511713",
    iosAppId: "ca-app-pub-3940256099942544~1458002511",
    appVersion: "1.0.3",
    BANNER_AD_UNIT_ID: "ca-app-pub-3406043589920136/4136707352",
    INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/2823625684",
    REWARDED_AD_UNIT_ID: "ca-app-pub-3406043589920136/5062776214",
    REWARDED_INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/3167278602"
  },
  or: {
    name: "ଗୀତା ଓଡ଼ିଆ",
    slug: "gita-odia",
    iosBundleIdentifier: "com.gita.odia",
    androidPackage: "com.gita.odia",
    primaryColor: "#ffffff",
    languageCode: "or",
    icon: "./clients/or/assets/images/icon.png",
    splash: "./clients/or/assets/images/splash-icon.png",
    adaptiveIcon: "./clients/or/assets/images/adaptive-icon.png",
    projectId: "9fdf2660-de92-4a98-a5d6-430dd6148fd0",
    androidAppId: "ca-app-pub-3406043589920136~2020163874",
    iosAppId: "ca-app-pub-3940256099942544~1458002511",
    appVersion: "1.0.0",
    BANNER_AD_UNIT_ID: "ca-app-pub-3406043589920136/6223132767",
    INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/5184000379",
    REWARDED_AD_UNIT_ID: "ca-app-pub-3406043589920136/2722871459",
    REWARDED_INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/3596969423"
  },
  en: {
    name: "Bhagavad Gita",
    slug: "bhagavad-gita-en",
    iosBundleIdentifier: "com.gita.english",
    androidPackage: "com.gita.english",
    primaryColor: "#ffffff",
    languageCode: "en",
    icon: "./clients/en/assets/images/icon.png",
    splash: "./clients/en/assets/images/splash-icon.png",
    adaptiveIcon: "./clients/en/assets/images/adaptive-icon.png",
    projectId: "4276c4fa-4062-4c56-9fb4-26fabacd8a23",
    androidAppId: "ca-app-pub-3940256099942544~3347511713",
    iosAppId: "ca-app-pub-3940256099942544~1458002511",
    appVersion: "1.0.0",
    BANNER_AD_UNIT_ID: "ca-app-pub-3406043589920136/4136707352",
    INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/2823625684",
    REWARDED_AD_UNIT_ID: "ca-app-pub-3406043589920136/5062776214",
    REWARDED_INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/3167278602"
  },
  hi: {
    name: "गीता हिंदी",
    slug: "gita-hindi",
    iosBundleIdentifier: "com.gita.hindi",
    androidPackage: "com.gita.hindi",
    primaryColor: "#ffffff",
    languageCode: "hi",
    icon: "./clients/hi/assets/images/icon.png",
    splash: "./clients/hi/assets/images/splash-icon.png",
    adaptiveIcon: "./clients/hi/assets/images/adaptive-icon.png",
    projectId: "4276c4fa-4062-4c56-9fb4-26fabacd8a23",
    androidAppId: "ca-app-pub-3940256099942544~3347511713",
    iosAppId: "ca-app-pub-3940256099942544~1458002511",
    appVersion: "1.0.0",
    BANNER_AD_UNIT_ID: "ca-app-pub-3406043589920136/4136707352",
    INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/2823625684",
    REWARDED_AD_UNIT_ID: "ca-app-pub-3406043589920136/5062776214",
    REWARDED_INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/3167278602"
  },
  as: {
    name: "গীতা অসমীয়া",
    slug: "gita-assamese",
    iosBundleIdentifier: "com.gita.assamese",
    androidPackage: "com.gita.assamese",
    primaryColor: "#ffffff",
    languageCode: "as",
    icon: "./clients/as/assets/images/icon.png",
    splash: "./clients/as/assets/images/splash-icon.png",
    adaptiveIcon: "./clients/as/assets/images/adaptive-icon.png",
    projectId: "4276c4fa-4062-4c56-9fb4-26fabacd8a23",
    androidAppId: "ca-app-pub-3940256099942544~3347511713",
    iosAppId: "ca-app-pub-3940256099942544~1458002511",
    appVersion: "1.0.0",
    BANNER_AD_UNIT_ID: "ca-app-pub-3406043589920136/4136707352",
    INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/2823625684",
    REWARDED_AD_UNIT_ID: "ca-app-pub-3406043589920136/5062776214",
    REWARDED_INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/3167278602"
  },
};

export default function ({ config = {} }) {
  // Re-get lang after loading environment variables
  const lang = process.env.APP_LANG || "bn";
  const langConf = languageConfigs[lang] || languageConfigs.bn;
  
  // Get configuration from languageConfigs
  const projectId = langConf.projectId;
  const androidAppId = langConf.androidAppId;
  const iosAppId = langConf.iosAppId;
  const appVersion = langConf.appVersion;
  

  return {
    ...config,
    name: langConf.name,
    slug: langConf.slug,
    version: appVersion,
    orientation: "portrait",
    icon: langConf.icon,
    scheme: "gita",
    splash: {
      image: langConf.splash,
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: langConf.iosBundleIdentifier,
    },
    android: {
      package: langConf.androidPackage,
      adaptiveIcon: {
        foregroundImage: langConf.adaptiveIcon,
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
    },
    extra: {
      LANGUAGE: langConf.languageCode,
      PRIMARY_COLOR: langConf.primaryColor,
      eas: { projectId },
      BANNER_AD_UNIT_ID: langConf.BANNER_AD_UNIT_ID,
      INTERSTITIAL_AD_UNIT_ID: langConf.INTERSTITIAL_AD_UNIT_ID,
      REWARDED_AD_UNIT_ID: langConf.REWARDED_AD_UNIT_ID,
      REWARDED_INTERSTITIAL_AD_UNIT_ID: langConf.REWARDED_INTERSTITIAL_AD_UNIT_ID
    },
    web: {
      output: "static",
      favicon: `./clients/${lang}/assets/images/favicon.png`,
    },
    plugins: [
      "expo-router",
      [
        "expo-build-properties",
        {
          ios: { useFrameworks: "static" },
          android: { enableMemoryPageSize16K: true },
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: androidAppId,
          iosAppId: iosAppId,
        },
      ],
      "expo-secure-store",
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
}
