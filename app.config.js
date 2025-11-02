export default function ({ config = {} }) {
  return {
    ...config,
    name: "গীতা বাংলা",
    slug: "bhagavad_gita",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "gita",
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.proninja.bhagavad-gita",
    },
    android: {
      package: "com.proninja.bhagavad_gita",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      permissions: [
        "android.permission.RECORD_AUDIO",
        "android.permission.MODIFY_AUDIO_SETTINGS",
      ],
    },
    extra: {
      LANGUAGE: "bn",
      PRIMARY_COLOR: "#ffffff",
      eas: { projectId: "4276c4fa-4062-4c56-9fb4-26fabacd8a23" },
      BANNER_AD_UNIT_ID: "ca-app-pub-3406043589920136/4136707352",
      INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/2823625684",
      REWARDED_AD_UNIT_ID: "ca-app-pub-3406043589920136/5062776214",
      REWARDED_INTERSTITIAL_AD_UNIT_ID: "ca-app-pub-3406043589920136/3167278602"
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
        "react-native-google-mobile-ads",
        {
          androidAppId: "ca-app-pub-3406043589920136~3347511713",
          iosAppId: "ca-app-pub-3940256099942544~1458002511",
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
