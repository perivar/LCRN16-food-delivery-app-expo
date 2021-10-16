import 'dotenv/config';

import { ConfigContext, ExpoConfig } from '@expo/config';
import dayjs from 'dayjs';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'myapp',
  slug: 'myapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: 'myapp',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    usesAppleSignIn: true,
    userInterfaceStyle: 'automatic',
    buildNumber: dayjs().unix().toString(),
    bundleIdentifier: 'com.perivar.myapp',
  },
  android: {
    package: 'com.perivar.myapp',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },
  web: {
    favicon: './assets/images/favicon.png',
  },
  extra: {
    apiKey: process.env.FIRE_BASE_API_KEY,
    authDomain: process.env.FIRE_BASE_AUTH_DOMAIN,
    projectId: process.env.FIRE_BASE_PROJECT_ID,
    storageBucket: process.env.FIRE_BASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIRE_BASE_MESSAGING_SENDER_ID,
    appId: process.env.FIRE_BASE_APP_ID,
    measurementId: process.env.FIRE_BASE_MEASUREMENT_ID,
    expoGoogleClientId: process.env.EXPO_GOOGLE_CLIENT_ID,
    expoFacebookClientId: process.env.EXPO_FACEBOOK_CLIENT_ID,
  },
});
