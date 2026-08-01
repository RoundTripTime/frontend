import type { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

type RequestLog = {
  method?: string;
  url?: string;
  params?: unknown;
  data?: unknown;
};

type ResponseLog = {
  status: number;
  method?: string;
  url?: string;
  data?: unknown;
  startedAt?: number;
};

type ErrorLog = {
  status?: number;
  method?: string;
  url?: string;
  data?: unknown;
  message?: string;
  startedAt?: number;
};

type LoggedRequestConfig = InternalAxiosRequestConfig & {
  _networkLogStartedAt?: number;
};

const sensitiveKeys = new Set([
  'access_token',
  'authorization',
  'id_token',
  'refresh_token',
  'secret',
]);

function elapsed(startedAt?: number): string {
  if (!startedAt) return '';
  return ` ${Date.now() - startedAt}ms`;
}

function redact(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(redact);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sensitiveKeys.has(key.toLowerCase()) ? '[REDACTED]' : redact(item),
    ]),
  );
}

export function logRequest(req: RequestLog): number | undefined {
  if (!__DEV__) return undefined;
  const startedAt = Date.now();
  console.log(`[API] → ${req.method?.toUpperCase() ?? 'GET'} ${req.url ?? ''}`, {
    params: redact(req.params),
    data: redact(req.data),
  });
  return startedAt;
}

export function logResponse(res: ResponseLog): void {
  if (!__DEV__) return;
  console.log(
    `[API] ← ${res.status} ${res.method?.toUpperCase() ?? 'GET'} ${res.url ?? ''}${elapsed(
      res.startedAt,
    )}`,
    redact(res.data),
  );
}

export function logResponseError(err: ErrorLog): void {
  if (!__DEV__) return;
  console.warn(
    `[API] ← ${err.status ?? 'ERR'} ${err.method?.toUpperCase() ?? 'GET'} ${err.url ?? ''}${elapsed(
      err.startedAt,
    )}`,
    redact(err.data ?? err.message),
  );
}

export function attachNetworkLogger(instance: AxiosInstance) {
  if (!__DEV__) {
    return;
  }

  instance.interceptors.request.use((config) => {
    const loggedConfig = config as LoggedRequestConfig;
    loggedConfig._networkLogStartedAt = logRequest({
      data: config.data,
      method: config.method,
      params: config.params,
      url: `${config.baseURL ?? ''}${config.url ?? ''}`,
    });

    return loggedConfig;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const config = response.config as LoggedRequestConfig;
      logResponse({
        data: response.data,
        method: config.method,
        startedAt: config._networkLogStartedAt,
        status: response.status,
        url: `${config.baseURL ?? ''}${config.url ?? ''}`,
      });

      return response;
    },
    (error: AxiosError) => {
      const config = error.config as LoggedRequestConfig | undefined;
      logResponseError({
        data: error.response?.data,
        message: error.message,
        method: config?.method,
        startedAt: config?._networkLogStartedAt,
        status: error.response?.status,
        url: `${config?.baseURL ?? ''}${config?.url ?? ''}`,
      });

      throw error;
    },
  );
}
