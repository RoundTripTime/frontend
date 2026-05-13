import assert from 'node:assert/strict';
import test from 'node:test';

import { AxiosHeaders, type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios';

import { applyAuthHeader, handleUnauthorizedRefresh } from '../client';

test('applyAuthHeader injects bearer token', async () => {
  const config = await applyAuthHeader(
    {
      headers: new AxiosHeaders(),
      method: 'get',
      url: '/users/me',
    },
    'access-token',
  );

  const headers = AxiosHeaders.from(config.headers);

  assert.equal(headers.get('Authorization'), 'Bearer access-token');
});

test('applyAuthHeader leaves headers unchanged when token is missing', async () => {
  const config = await applyAuthHeader(
    {
      headers: new AxiosHeaders({ Accept: 'application/json' }),
      method: 'get',
      url: '/users/me',
    },
    null,
  );

  const headers = AxiosHeaders.from(config.headers);

  assert.equal(headers.get('Authorization'), undefined);
  assert.equal(headers.get('Accept'), 'application/json');
});

test('handleUnauthorizedRefresh refreshes access token and retries once', async () => {
  const retriedRequests: unknown[] = [];
  const instance = (async (config: unknown) => {
    retriedRequests.push(config);
    return {
      data: { ok: true },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    } as AxiosResponse;
  }) as AxiosInstance;

  const error = {
    config: {
      headers: new AxiosHeaders(),
      method: 'get',
      url: '/users/me',
    },
    response: {
      status: 401,
    },
  } as AxiosError;

  const response = await handleUnauthorizedRefresh(error, instance, {
    getRefreshToken: () => 'refresh-token',
    refreshAccessToken: async (refreshToken) => {
      assert.equal(refreshToken, 'refresh-token');
      return 'new-access-token';
    },
  });

  const retriedConfig = retriedRequests[0] as { headers: AxiosHeaders; _retry?: boolean };
  const headers = AxiosHeaders.from(retriedConfig.headers);

  assert.equal(response.status, 200);
  assert.equal(retriedConfig._retry, true);
  assert.equal(headers.get('Authorization'), 'Bearer new-access-token');
});

test('handleUnauthorizedRefresh maps non-401 errors without retrying', async () => {
  const instance = (async () => {
    throw new Error('should not retry');
  }) as unknown as AxiosInstance;

  const error = {
    message: 'Forbidden',
    config: {
      headers: new AxiosHeaders(),
      method: 'get',
      url: '/users/me',
    },
    response: {
      status: 403,
      data: {
        error: {
          code: 'FORBIDDEN',
          message: '권한 없음',
        },
      },
    },
  } as AxiosError;

  await assert.rejects(
    () =>
      handleUnauthorizedRefresh(error, instance, {
        getRefreshToken: () => 'refresh-token',
        refreshAccessToken: async () => 'new-access-token',
      }),
    { code: 'FORBIDDEN', message: '권한이 없습니다.' },
  );
});
