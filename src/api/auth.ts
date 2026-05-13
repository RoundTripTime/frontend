import { apiClient } from './client';

import type {
  RefreshTokenRequest,
  RefreshTokenResponse,
  SocialLoginRequest,
  SocialLoginResponse,
} from './auth/types';

export async function socialLogin(body: SocialLoginRequest) {
  const { data } = await apiClient.post<SocialLoginResponse>('/auth/social', body);
  return data;
}

export async function refreshToken(body: RefreshTokenRequest) {
  const { data } = await apiClient.post<RefreshTokenResponse>('/auth/refresh', body);
  return data;
}

export async function logout() {
  await apiClient.delete('/auth/session');
}
