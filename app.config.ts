import type { ExpoConfig } from 'expo/config';

const APP_ENV_MODES = {
  development: {
    appEnv: 'development',
    showDevScreenHeader: true,
    useApiMocks: true,
  },
  preview: {
    appEnv: 'preview',
    showDevScreenHeader: false,
    useApiMocks: true,
  },
  production: {
    appEnv: 'production',
    showDevScreenHeader: false,
    useApiMocks: false,
  },
} as const;

type AppEnvMode = keyof typeof APP_ENV_MODES;

const requestedAppEnv = (process.env.APP_ENV ?? '').trim().toLowerCase();
const appMode = APP_ENV_MODES[requestedAppEnv as AppEnvMode] ?? APP_ENV_MODES.development;

const googleIosUrlScheme =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ?? 'com.googleusercontent.apps.REPLACE_ME';
const kakaoNativeAppKey =
  process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY ?? 'KAKAO_NATIVE_APP_KEY_REQUIRED';

const config: ExpoConfig = {
  name: 'Round Trip',
  slug: 'round-trip',
  scheme: 'roundtrip',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  icon: './assets/images/icon.png',
  ios: {
    bundleIdentifier: 'com.seungmin.roundtrip',
    supportsTablet: false,
  },
  android: {
    package: 'com.seungmin.roundtrip',
    adaptiveIcon: {
      backgroundColor: '#3182F6',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-secure-store',
    [
      '@react-native-google-signin/google-signin',
      {
        iosUrlScheme: googleIosUrlScheme,
      },
    ],
    [
      '@react-native-seoul/kakao-login',
      {
        kakaoAppKey: kakaoNativeAppKey,
      },
    ],
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#ffffff',
        dark: {
          backgroundColor: '#ffffff',
        },
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    appMode,
    googleIosUrlScheme,
    kakaoNativeAppKey,
    // EAS 가 `eas init` 시 `eas.projectId` 를 자동 주입함.
    // 그 외 런타임 키는 `EXPO_PUBLIC_*` 로 직접 접근 (process.env.EXPO_PUBLIC_*).
  },
};

export default config;
