import Constants from 'expo-constants';

export type AppEnv = 'development' | 'preview' | 'production';

type RuntimeAppMode = {
  appEnv?: AppEnv;
  apiBaseUrl?: string;
  useApiMocks?: boolean;
};

const DEFAULT_APP_MODE: Required<Pick<RuntimeAppMode, 'appEnv' | 'useApiMocks'>> = {
  appEnv: 'development',
  useApiMocks: true,
};

function readRuntimeAppMode(): RuntimeAppMode {
  return (Constants.expoConfig?.extra?.appMode as RuntimeAppMode | undefined) ?? {};
}

export const appMode = {
  ...DEFAULT_APP_MODE,
  ...readRuntimeAppMode(),
};

export const currentAppEnv = appMode.appEnv;
export const useApiMocksEnabled = appMode.useApiMocks === true;
export const isDevelopmentMode = currentAppEnv === 'development';
export const isProductionMode = currentAppEnv === 'production';

export function shouldUseApiMocks() {
  return useApiMocksEnabled;
}
