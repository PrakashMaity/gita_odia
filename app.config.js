import 'dotenv/config';

const languageConfigs = {
  bn: {
    name: "গীতা বাংলা",
    slug: "gita-bangla",
    iosBundleIdentifier: "com.gita.bangla",
    androidPackage: "com.gita.bangla",
    primaryColor: "#ffffff",
    languageCode: "bn",
  },
  or: {
    name: "ଗୀତା ଓଡ଼ିଆ",
    slug: "gita-odia",
    iosBundleIdentifier: "com.gita.odia",
    androidPackage: "com.gita.odia",
    primaryColor: "#ffffff",
    languageCode: "or",
  },
  hi: {
    name: "गीता हिंदी",
    slug: "gita-hindi",
    iosBundleIdentifier: "com.gita.hindi",
    androidPackage: "com.gita.hindi",
    primaryColor: "#ffffff",
    languageCode: "hi",
  },
  as: {
    name: "গীতা অসমীয়া",
    slug: "gita-assamese",
    iosBundleIdentifier: "com.gita.assamese",
    androidPackage: "com.gita.assamese",
    primaryColor: "#ffffff",
    languageCode: "as",
  },
};

// ✅ Important: Default config param
export default function ({ config = {} }) {
  const lang = process.env.APP_LANG || "bn";
  const langConf = languageConfigs[lang] || languageConfigs.bn;

  return {
    ...config,
    name: langConf.name,
    slug: langConf.slug,
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gita",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,

    ios: {
      supportsTablet: true,
      bundleIdentifier: langConf.iosBundleIdentifier,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      package: langConf.androidPackage,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
    },

    extra: {
      ...config.extra,
      LANGUAGE: langConf.languageCode,
      PRIMARY_COLOR: langConf.primaryColor,
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
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
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-audio",
        {
          microphonePermission: "Allow $(PRODUCT_NAME) to access your microphone.",
        },
      ],
      [
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-3406043589920136~9029941389",
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
