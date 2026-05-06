import * as Sentry from '@sentry/react-native';
import Constants from 'expo-constants';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
const appEnv = (Constants.expoConfig?.extra?.appEnv as string | undefined) ?? 'development';

let initialized = false;

export function initSentry(): void {
  if (initialized) return;
  if (!dsn) return;

  Sentry.init({
    dsn,
    environment: appEnv,
    debug: appEnv !== 'production',
    enableAutoSessionTracking: true,
    tracesSampleRate: appEnv === 'production' ? 0.1 : 1.0,
  });
  initialized = true;
}

export function captureException(error: unknown): void {
  if (!initialized) return;
  Sentry.captureException(error);
}

export const sentryEnabled = (): boolean => initialized;
