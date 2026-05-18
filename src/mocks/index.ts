import {
  AxiosError,
  AxiosHeaders,
  getAdapter,
  type AxiosAdapter,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import Constants from 'expo-constants';

import { logger } from '@/src/lib/logger';
import { resolveMockResponse } from '@/src/mocks/handlers';

const installedClients = new WeakSet<AxiosInstance>();
const appMode = Constants.expoConfig?.extra?.appMode as { useApiMocks?: boolean } | undefined;

export function shouldUseApiMocks() {
  return appMode?.useApiMocks ?? true;
}

function createAxiosResponse(
  config: InternalAxiosRequestConfig,
  mockResponse: Awaited<ReturnType<typeof resolveMockResponse>>,
): AxiosResponse {
  if (!mockResponse) {
    throw new Error('Mock response is required.');
  }

  return {
    config,
    data: mockResponse.data,
    headers: AxiosHeaders.from(mockResponse.headers ?? {}),
    request: { mock: true },
    status: mockResponse.status,
    statusText: mockResponse.statusText ?? 'OK',
  };
}

function shouldResolveResponse(config: InternalAxiosRequestConfig, response: AxiosResponse) {
  const validateStatus =
    config.validateStatus ?? ((status: number) => status >= 200 && status < 300);
  return validateStatus(response.status);
}

export function installApiMockAdapter(instance: AxiosInstance) {
  if (!shouldUseApiMocks() || installedClients.has(instance)) {
    return;
  }

  const realAdapter = getAdapter(instance.defaults.adapter);

  const mockAdapter: AxiosAdapter = async (config) => {
    const mockResponse = await resolveMockResponse(config);

    if (!mockResponse) {
      return realAdapter(config);
    }

    const response = createAxiosResponse(config, mockResponse);

    if (shouldResolveResponse(config, response)) {
      return response;
    }

    throw new AxiosError(
      `Request failed with status code ${response.status}`,
      response.status >= 500 ? AxiosError.ERR_BAD_RESPONSE : AxiosError.ERR_BAD_REQUEST,
      config,
      response.request,
      response,
    );
  };

  instance.defaults.adapter = mockAdapter;
  installedClients.add(instance);
  logger.info('API mock adapter enabled.');
}
