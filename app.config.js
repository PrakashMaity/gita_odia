import { existsSync } from 'fs';
import { join } from 'path';

export default function ({ config = {} }) {
  // Check if Firebase config files exist (using process.cwd() for Expo config files)
  const projectRoot = process.cwd();
  const googleServicesJsonExists = existsSync(join(projectRoot, 'google-services.json'));
  const googleServicesPlistExists = existsSync(join(projectRoot, 'GoogleService-Info.plist'));

  // Build plugins array
  const plugins = [
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
  ];

  // Only add Firebase plugin if config files exist
  if (googleServicesJsonExists || googleServicesPlistExists) {
    plugins.push([
      "@react-native-firebase/app",
      {
        android: googleServicesJsonExists ? {
          googleServicesFile: "./google-services.json",
        } : undefined,
        ios: googleServicesPlistExists ? {
          googleServicesFile: "./GoogleService-Info.plist",
        } : undefined,
      },
    ]);
  }

  plugins.push(
    [
      "expo-notifications",
      {
        icon: "./assets/images/icon.png",
        color: "#ffffff",
        sounds: [],
      },
    ],
    "expo-secure-store"
  );

  const androidConfig = {
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
  };

  const iosConfig = {
    supportsTablet: true,
    bundleIdentifier: "com.proninja.bhagavad-gita",
  };

  // Only add googleServicesFile if the file exists
  if (googleServicesJsonExists) {
    androidConfig.googleServicesFile = "./google-services.json";
  }
  if (googleServicesPlistExists) {
    iosConfig.googleServicesFile = "./GoogleService-Info.plist";
  }

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
    ios: iosConfig,
    android: androidConfig,
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
    plugins,
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
}
