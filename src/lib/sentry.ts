import * as Sentry from '@sentry/react-native';

import { currentAppEnv } from './appMode';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

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
