const { existsSync } = require('fs');
const { join } = require('path');
const { config: loadEnv } = require('dotenv');

// ----- Multi-client env loading -----
const APP_LANG = process.env.APP_LANG || 'bn';
const APP_ENV = process.env.APP_ENV || 'development';
const envFile = `.env.${APP_LANG}.${APP_ENV}`;
const envPath = join(__dirname, envFile);

if (existsSync(envPath)) {
  loadEnv({ path: envPath });
} else {
  console.warn(`⚠️  Env file not found: ${envFile}. Using defaults or process.env.`);
}

// ----- Google Services -----
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
  splashBackground: '#FFE0B2', // Light saffron - matches theme
};

// ----- Keys for expo extra config -----
const EXTRA_KEYS = {
  language: 'LANGUAGE',
  primaryColor: 'PRIMARY_COLOR',
  bannerAdUnitId: 'BANNER_AD_UNIT_ID',
  interstitialAdUnitId: 'INTERSTITIAL_AD_UNIT_ID',
  rewardedAdUnitId: 'REWARDED_AD_UNIT_ID',
  rewardedInterstitialAdUnitId: 'REWARDED_INTERSTITIAL_AD_UNIT_ID',
};

// ----- Ad Unit IDs (from env) -----
const AD_UNIT_IDS = {
  banner: process.env.BANNER_AD_UNIT_ID || 'ca-app-pub-3406043589920136/4136707352',
  interstitial: process.env.INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-3406043589920136/2823625684',
  rewarded: process.env.REWARDED_AD_UNIT_ID || 'ca-app-pub-3406043589920136/5062776214',
  rewardedInterstitial: process.env.REWARDED_INTERSTITIAL_AD_UNIT_ID || 'ca-app-pub-3406043589920136/3167278602',
};

// ----- Mobile Ads Config (from env) -----
const MOBILE_ADS_CONFIG = {
  androidAppId: process.env.ADMOB_ANDROID_APP_ID || 'ca-app-pub-3406043589920136~3347511713',
  iosAppId: process.env.ADMOB_IOS_APP_ID || 'ca-app-pub-3940256099942544~1458002511',
};

// ----- App Info (from env) -----
const APP_INFO = {
  name: process.env.APP_NAME || 'গীতা বাংলা',
  slug: 'bhagavad_gita',
  version: '2.0.0',
  package: process.env.APP_PACKAGE || 'com.proninja.bhagavad_gita',
  bundleIdentifier: process.env.APP_BUNDLE_ID || 'com.proninja.bhagavad-gita',
  scheme: 'gita',
};

module.exports = function ({ config = {} }) {
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
    const firebaseConfig = {};
    if (googleServicesJsonExists) {
      firebaseConfig.android = { googleServicesFile: PATHS.googleServicesJson };
    }
    if (googleServicesPlistExists) {
      firebaseConfig.ios = { googleServicesFile: PATHS.googleServicesPlist };
    }
    plugins.push(['@react-native-firebase/app', firebaseConfig]);
  }

  plugins.push('expo-secure-store');

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

  const easProjectId = process.env.EAS_PROJECT_ID || '4276c4fa-4062-4c56-9fb4-26fabacd8a23';

  const extra = {
    [EXTRA_KEYS.language]: APP_LANG,
    [EXTRA_KEYS.primaryColor]: COLORS.primary,
    eas: { projectId: easProjectId },
    [EXTRA_KEYS.bannerAdUnitId]: AD_UNIT_IDS.banner,
    [EXTRA_KEYS.interstitialAdUnitId]: AD_UNIT_IDS.interstitial,
    [EXTRA_KEYS.rewardedAdUnitId]: AD_UNIT_IDS.rewarded,
    [EXTRA_KEYS.rewardedInterstitialAdUnitId]: AD_UNIT_IDS.rewardedInterstitial,
    // Supabase (read by services at runtime via Constants)
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://bxcjjqyalflohwjyxdze.supabase.co',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
    // RevenueCat
    REVENUECAT_ANDROID_API_KEY: process.env.REVENUECAT_ANDROID_API_KEY || '',
    REVENUECAT_IOS_API_KEY: process.env.REVENUECAT_IOS_API_KEY || '',
  };

  return {
    ...config,
    name: APP_INFO.name,
    slug: APP_INFO.slug,
    version: APP_INFO.version,
    orientation: 'default',
    icon: PATHS.icon,
    scheme: APP_INFO.scheme,
    splash: {
      image: PATHS.splash,
      resizeMode: 'contain',
      backgroundColor: COLORS.splashBackground,
    },
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    runtimeVersion: '1.0.0',
    updates: {
      url: `https://u.expo.dev/${easProjectId}`,
    },
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
};
