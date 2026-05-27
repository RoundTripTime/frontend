import {
  AxiosError,
  AxiosHeaders,
  create,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';

import { attachNetworkLogger } from '@/src/lib/networkLogger';
import { installApiMockAdapter } from '@/src/mocks';

import { mapApiError } from './errorMap';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.example.com';
export const API_TIMEOUT_MS = 10000;

export type TokenProvider = () => string | null | Promise<string | null>;
export type RefreshTokenProvider = () => string | null | Promise<string | null>;
export type TokenRefreshHandler = (refreshToken: string) => Promise<string>;
export type TokenPersistHandler = (accessToken: string) => void | Promise<void>;
export type AuthFailureHandler = () => void | Promise<void>;

export type AuthInterceptorOptions = {
  getAccessToken: TokenProvider;
};

export type ResponseInterceptorOptions = {
  getRefreshToken: RefreshTokenProvider;
  refreshAccessToken: TokenRefreshHandler;
  setAccessToken?: TokenPersistHandler;
  onAuthFailure?: AuthFailureHandler;
};

type RetriableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

export const apiClient = create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

attachNetworkLogger(apiClient);
installApiMockAdapter(apiClient);

export async function applyAuthHeader(
  config: InternalAxiosRequestConfig,
  token: string | null,
): Promise<InternalAxiosRequestConfig> {
  if (!token) {
    return config;
  }

  const headers = AxiosHeaders.from(config.headers);
  headers.set('Authorization', `Bearer ${token}`);

  return {
    ...config,
    headers,
  };
}

export function attachAuthInterceptor(
  instance: AxiosInstance,
  options: AuthInterceptorOptions,
): number {
  return instance.interceptors.request.use(async (config) => {
    const token = await options.getAccessToken();
    return applyAuthHeader(config, token);
  });
}

export async function handleUnauthorizedRefresh(
  error: AxiosError,
  instance: AxiosInstance,
  options: ResponseInterceptorOptions,
): Promise<AxiosResponse> {
  const originalRequest = error.config as RetriableRequestConfig | undefined;

  if (
    error.response?.status !== 401 ||
    !originalRequest ||
    originalRequest._retry ||
    originalRequest.url?.includes('/auth/refresh')
  ) {
    throw mapApiError(error);
  }

  originalRequest._retry = true;

  const refreshToken = await options.getRefreshToken();

  if (!refreshToken) {
    await options.onAuthFailure?.();
    throw mapApiError(error);
  }

  try {
    const accessToken = await options.refreshAccessToken(refreshToken);
    await options.setAccessToken?.(accessToken);

    const headers = AxiosHeaders.from(originalRequest.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);
    originalRequest.headers = headers;

    return instance(originalRequest);
  } catch (refreshError) {
    await options.onAuthFailure?.();
    throw mapApiError(refreshError);
  }
}

export function attachResponseInterceptor(
  instance: AxiosInstance,
  options: ResponseInterceptorOptions,
): number {
  return instance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => handleUnauthorizedRefresh(error, instance, options),
  );
}
