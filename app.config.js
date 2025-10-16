// # Bengali
// APP_LANG=bn eas build --platform android --profile bn

// # Odia
// APP_LANG=or eas build --platform android --profile or

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

// Unique EAS project IDs per client
const projectIds = {
  bn: "4276c4fa-4062-4c56-9fb4-26fabacd8a23",
  or: "9fdf2660-de92-4a98-a5d6-430dd6148fd0",
  hi: "c842f4d5-b216-4886-8e56-79155fa30c61",
  as: "8e3998ea-85e5-45c5-81ac-484f0ab9daa4",
};

export default function ({ config = {} }) {
  const lang = process.env.APP_LANG || "bn";
  const langConf = languageConfigs[lang] || languageConfigs.bn;
  const projectId = projectIds[lang];

  return {
    ...config,
    name: langConf.name,
    slug: langConf.slug,
    version: "1.0.2",
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
          androidAppId: "ca-app-pub-3406043589920136~9029941389",
          iosAppId: "ca-app-pub-3406043589920136~5828287268",
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
