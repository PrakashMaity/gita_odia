import { existsSync } from 'fs';
import { join } from 'path';

const GOOGLE_SERVICE_FILES = {
  json: 'google-services.json',
  plist: 'GoogleService-Info.plist',
};

const PATHS = {
  googleServicesJson: `./${GOOGLE_SERVICE_FILES.json}`,
  googleServicesPlist: `./${GOOGLE_SERVICE_FILES.plist}`,
  icon: './assets/images/icon.png',
  adaptiveIcon: './assets/images/adaptive-icon.png',
  splash: './assets/images/splash-icon.png',
  favicon: './assets/images/favicon.png',
};

const COLORS = {
  primary: '#ffffff',
};

const EXTRA_KEYS = {
  language: 'LANGUAGE',
  primaryColor: 'PRIMARY_COLOR',
  bannerAdUnitId: 'BANNER_AD_UNIT_ID',
  interstitialAdUnitId: 'INTERSTITIAL_AD_UNIT_ID',
  rewardedAdUnitId: 'REWARDED_AD_UNIT_ID',
  rewardedInterstitialAdUnitId: 'REWARDED_INTERSTITIAL_AD_UNIT_ID',
};

const AD_UNIT_IDS = {
  banner: 'ca-app-pub-3406043589920136/4136707352',
  interstitial: 'ca-app-pub-3406043589920136/2823625684',
  rewarded: 'ca-app-pub-3406043589920136/5062776214',
  rewardedInterstitial: 'ca-app-pub-3406043589920136/3167278602',
};

const MOBILE_ADS_CONFIG = {
  androidAppId: 'ca-app-pub-3406043589920136~3347511713',
  iosAppId: 'ca-app-pub-3940256099942544~1458002511',
};

const APP_INFO = {
  name: 'গীতা বাংলা',
  slug: 'bhagavad_gita',
  version: '1.0.3',
  package: 'com.proninja.bhagavad_gita',
  bundleIdentifier: 'com.proninja.bhagavad-gita',
  scheme: 'gita',
};

export default function ({ config = {} }) {
  const projectRoot = process.cwd();
  const googleServicesJsonExists = existsSync(join(projectRoot, GOOGLE_SERVICE_FILES.json));
  const googleServicesPlistExists = existsSync(join(projectRoot, GOOGLE_SERVICE_FILES.plist));

  const plugins = [
    'expo-router',
    [
      'expo-build-properties',
      {
        ios: { useFrameworks: 'static' },
        android: { enableMemoryPageSize16K: true },
      },
    ],
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: MOBILE_ADS_CONFIG.androidAppId,
        iosAppId: MOBILE_ADS_CONFIG.iosAppId,
      },
    ],
  ];

  if (googleServicesJsonExists || googleServicesPlistExists) {
    plugins.push([
      '@react-native-firebase/app',
      {
        android: googleServicesJsonExists
          ? { googleServicesFile: PATHS.googleServicesJson }
          : undefined,
        ios: googleServicesPlistExists
          ? { googleServicesFile: PATHS.googleServicesPlist }
          : undefined,
      },
    ]);
  }

  plugins.push(
    [
      'expo-notifications',
      {
        icon: PATHS.icon,
        color: COLORS.primary,
        sounds: [],
      },
    ],
    'expo-secure-store'
  );

  const androidConfig = {
    package: APP_INFO.package,
    adaptiveIcon: {
      foregroundImage: PATHS.adaptiveIcon,
      backgroundColor: COLORS.primary,
    },
    edgeToEdgeEnabled: true,
    permissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.MODIFY_AUDIO_SETTINGS',
    ],
    googleServicesFile: PATHS.googleServicesJson,
  };

  const iosConfig = {
    supportsTablet: true,
    bundleIdentifier: APP_INFO.bundleIdentifier,
  };

  if (googleServicesJsonExists) {
    androidConfig.googleServicesFile = PATHS.googleServicesJson;
  }
  if (googleServicesPlistExists) {
    iosConfig.googleServicesFile = PATHS.googleServicesPlist;
  }

  const extra = {
    [EXTRA_KEYS.language]: 'bn',
    [EXTRA_KEYS.primaryColor]: COLORS.primary,
    eas: { projectId: '4276c4fa-4062-4c56-9fb4-26fabacd8a23' },
    [EXTRA_KEYS.bannerAdUnitId]: AD_UNIT_IDS.banner,
    [EXTRA_KEYS.interstitialAdUnitId]: AD_UNIT_IDS.interstitial,
    [EXTRA_KEYS.rewardedAdUnitId]: AD_UNIT_IDS.rewarded,
    [EXTRA_KEYS.rewardedInterstitialAdUnitId]: AD_UNIT_IDS.rewardedInterstitial,
  };

  return {
    ...config,
    name: APP_INFO.name,
    slug: APP_INFO.slug,
    version: APP_INFO.version,
    orientation: 'portrait',
    icon: PATHS.icon,
    scheme: APP_INFO.scheme,
    splash: {
      image: PATHS.splash,
      resizeMode: 'contain',
      backgroundColor: COLORS.primary,
    },
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: iosConfig,
    android: androidConfig,
    extra,
    web: {
      output: 'static',
      favicon: PATHS.favicon,
    },
    plugins,
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
}
