import type { ExpoConfig } from 'expo/config';

const APP_IDENTIFIERS = {
  androidPackage: 'com.roundtriptime.roundtrip',
  iosBundleIdentifier: 'com.roundtriptime.roundtrip',
} as const;

const APP_ENV_MODES = {
  development: {
    appEnv: 'development',
    useApiMocks: true,
  },
  preview: {
    appEnv: 'preview',
    useApiMocks: true,
  },
  production: {
    appEnv: 'production',
    useApiMocks: false,
  },
} as const;

type AppEnvMode = keyof typeof APP_ENV_MODES;

const requestedAppEnv = (process.env.APP_ENV ?? '').trim().toLowerCase();
const appMode = APP_ENV_MODES[requestedAppEnv as AppEnvMode] ?? APP_ENV_MODES.development;

const googleIosUrlScheme =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_URL_SCHEME ?? 'com.googleusercontent.apps.REPLACE_ME';
const rawKakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY?.trim();
const rawKakaoJsKey = process.env.EXPO_PUBLIC_KAKAO_JS_KEY?.trim();
const kakaoNativeAppKey = rawKakaoNativeAppKey ?? 'KAKAO_NATIVE_APP_KEY_REQUIRED';
const isInvalidKakaoNativeAppKey =
  !rawKakaoNativeAppKey ||
  rawKakaoNativeAppKey === '...' ||
  rawKakaoNativeAppKey.includes('*') ||
  !/^[0-9a-f]{32}$/i.test(rawKakaoNativeAppKey);
const isInvalidKakaoJsKey =
  !rawKakaoJsKey ||
  rawKakaoJsKey === '...' ||
  rawKakaoJsKey.includes('*') ||
  !/^[0-9a-f]{32}$/i.test(rawKakaoJsKey);

if (process.env.EAS_BUILD === 'true' && isInvalidKakaoNativeAppKey) {
  throw new Error(
    'EXPO_PUBLIC_KAKAO_NATIVE_APP_KEY must be the 32-character Kakao Native App Key. Do not use masked values such as "...".',
  );
}

if (process.env.EAS_BUILD === 'true' && isInvalidKakaoJsKey) {
  throw new Error(
    'EXPO_PUBLIC_KAKAO_JS_KEY must be the 32-character Kakao JavaScript Key. Do not use masked values such as "...".',
  );
}
const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://roundtrip.duckdns.org';
const usesCleartextApiTraffic = apiBaseUrl.startsWith('http://');

const androidConfig: NonNullable<ExpoConfig['android']> & { usesCleartextTraffic?: boolean } = {
  package: APP_IDENTIFIERS.androidPackage,
  adaptiveIcon: {
    backgroundColor: '#3182F6',
    foregroundImage: './assets/images/android-icon-foreground.png',
    backgroundImage: './assets/images/android-icon-background.png',
    monochromeImage: './assets/images/android-icon-monochrome.png',
  },
  edgeToEdgeEnabled: true,
  googleServicesFile: './google-services.json',
  predictiveBackGestureEnabled: false,
  permissions: ['INTERNET'],
  usesCleartextTraffic: usesCleartextApiTraffic,
};

const config: ExpoConfig = {
  owner: 'roundtriptime',
  name: 'Round Trip',
  slug: 'round-trip',
  scheme: 'roundtrip',
  version: '0.0.1',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  icon: './assets/images/icon.png',
  ios: {
    bundleIdentifier: APP_IDENTIFIERS.iosBundleIdentifier,
    infoPlist: usesCleartextApiTraffic
      ? {
          NSAppTransportSecurity: {
            NSAllowsArbitraryLoads: true,
          },
        }
      : undefined,
    supportsTablet: false,
  },
  android: androidConfig,
  web: {
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    'expo-background-task',
    'expo-secure-store',
    './plugins/withAndroidShareReceive',
    'expo-video',
    'expo-font',
    '@react-native-community/datetimepicker',
    '@sentry/react-native',
    [
      'expo-build-properties',
      {
        android: {
          kotlinVersion: '2.1.20',
          extraMavenRepos: ['https://devrepo.kakao.com/nexus/content/groups/public/'],
        },
      },
    ],
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
    eas: {
      projectId: 'cc78e6d8-c816-40b2-bd08-17583fed348a',
    },
    appMode,
    apiBaseUrl,
    androidPackage: APP_IDENTIFIERS.androidPackage,
    iosBundleIdentifier: APP_IDENTIFIERS.iosBundleIdentifier,
    googleIosUrlScheme,
    kakaoNativeAppKey,
    // 런타임 키는 `EXPO_PUBLIC_*` 로 직접 접근 (process.env.EXPO_PUBLIC_*).
  },
};

export default config;
