import { logger } from '@/src/lib/logger';

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

function elapsed(startedAt?: number): string {
  if (!startedAt) return '';
  return ` ${Date.now() - startedAt}ms`;
}

export function logRequest(req: RequestLog): number | undefined {
  if (!__DEV__) return undefined;
  const startedAt = Date.now();
  logger.debug(`→ ${req.method?.toUpperCase() ?? 'GET'} ${req.url ?? ''}`, {
    params: req.params,
    data: req.data,
  });
  return startedAt;
}

export function logResponse(res: ResponseLog): void {
  if (!__DEV__) return;
  logger.debug(
    `← ${res.status} ${res.method?.toUpperCase() ?? 'GET'} ${res.url ?? ''}${elapsed(res.startedAt)}`,
    res.data,
  );
}

export function logResponseError(err: ErrorLog): void {
  if (!__DEV__) return;
  logger.warn(
    `← ${err.status ?? 'ERR'} ${err.method?.toUpperCase() ?? 'GET'} ${err.url ?? ''}${elapsed(err.startedAt)}`,
    err.data ?? err.message,
  );
}
