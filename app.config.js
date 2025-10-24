// Load environment variables
import { config } from 'dotenv';

// Load environment variables based on APP_LANG
const lang = process.env.APP_LANG || 'bn';
config({ path: `.env.${lang}` });

// # Bengali
// APP_LANG=bn eas build --platform android --profile bn

// # Odia
// APP_LANG=or eas build --platform android --profile or

// # English
// APP_LANG=en eas build --platform android --profile en

// # Hindi
// APP_LANG=hi eas build --platform android --profile hi

// # Assamese
// APP_LANG=as eas build --platform android --profile as


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
  },
};

export default function ({ config = {} }) {
  // Re-get lang after loading environment variables
  const lang = process.env.APP_LANG || "bn";
  const langConf = languageConfigs[lang] || languageConfigs.bn;
  
  // Get configuration from environment variables
  const projectId = process.env.PROJECT_ID;
  // Use Google's test IDs as fallback if not provided
  const androidAppId = process.env.ANDROID_APP_ID || "ca-app-pub-3940256099942544~3347511713";
  const iosAppId = process.env.IOS_APP_ID || "ca-app-pub-3940256099942544~1458002511";
  
  // Get version from environment variable (from .env files)
  const appVersion = process.env.APP_VERSION || "1.0.0";
  
  // Get ad unit IDs from environment variables
  const bannerAdUnitId = process.env.BANNER_AD_UNIT_ID;
  const interstitialAdUnitId = process.env.INTERSTITIAL_AD_UNIT_ID;
  const rewardedAdUnitId = process.env.REWARDED_AD_UNIT_ID;
  const rewardedInterstitialAdUnitId = process.env.REWARDED_INTERSTITIAL_AD_UNIT_ID;

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
      // Ad unit IDs from environment variables
      BANNER_AD_UNIT_ID: bannerAdUnitId,
      INTERSTITIAL_AD_UNIT_ID: interstitialAdUnitId,
      REWARDED_AD_UNIT_ID: rewardedAdUnitId,
      REWARDED_INTERSTITIAL_AD_UNIT_ID: rewardedInterstitialAdUnitId,
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
