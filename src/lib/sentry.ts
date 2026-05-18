import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const appMode = Constants.expoConfig?.extra?.appMode as { appEnv?: string } | undefined;
const currentAppEnv = appMode?.appEnv ?? 'development';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: currentAppEnv,
    debug: currentAppEnv !== 'production',
    enableAutoSessionTracking: true,
    tracesSampleRate: currentAppEnv === 'production' ? 0.1 : 1.0,
  });
  initialized = true;
}

export function captureException(error: unknown): void {
  if (!initialized) return;
  Sentry.captureException(error);
}

export const sentryEnabled = (): boolean => initialized;
